import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils"
import bcrypt from "bcryptjs"

export type ProcessedLink = {
  url: string
  slug: string
  password: string | null
  expiresAt: Date | null
}

export type ProcessLinkResult =
  | { error: string; code: string }
  | { link: ProcessedLink }

export async function processLink({
  url,
  slug,
  password,
  expiresAt,
}: {
  url: string
  slug?: string
  password?: string
  expiresAt?: string
}): Promise<ProcessLinkResult> {

  // 1. Validate URL — must be http or https
  try {
    const parsed = new URL(url)
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { error: "URL must start with http or https", code: "invalid_url" }
    }
  } catch {
    return { error: "Invalid URL", code: "invalid_url" }
  }

  // 2. Generate slug if not provided, otherwise validate the provided one
  let finalSlug: string
  if (!slug) {
    // generate a unique slug, retry if collision
    let attempts = 0
    do {
      finalSlug = generateSlug()
      attempts++
      if (attempts > 10) {
        return { error: "Could not generate unique slug", code: "slug_error" }
      }
    } while (await prisma.link.findUnique({ where: { slug: finalSlug } }))
  } else {
    // validate provided slug: only letters, numbers, hyphens, 3-50 chars
    if (!/^[a-zA-Z0-9-]{3,50}$/.test(slug)) {
      return {
        error: "Slug can only contain letters, numbers, and hyphens (3-50 characters)",
        code: "invalid_slug",
      }
    }
    // check if slug is already taken
    const existing = await prisma.link.findUnique({ where: { slug } })
    if (existing) {
      return { error: "This slug is already taken", code: "slug_conflict" }
    }
    finalSlug = slug
  }

  // 3. Hash password if provided
  let hashedPassword: string | null = null
  if (password && password.trim().length > 0) {
    hashedPassword = await bcrypt.hash(password, 10)
  }

  // 4. Parse expiresAt if provided
  let parsedExpiresAt: Date | null = null
  if (expiresAt) {
    parsedExpiresAt = new Date(expiresAt)
    if (isNaN(parsedExpiresAt.getTime())) {
      return { error: "Invalid expiry date", code: "invalid_date" }
    }
    if (parsedExpiresAt < new Date()) {
      return { error: "Expiry date must be in the future", code: "invalid_date" }
    }
  }

  return {
    link: {
      url,
      slug: finalSlug,
      password: hashedPassword,
      expiresAt: parsedExpiresAt,
    },
  }
}
