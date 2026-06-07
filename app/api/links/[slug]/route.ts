import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { linkCache } from "@/lib/api/links/cache"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // 1. Check the link exists first
    const link = await prisma.link.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!link) {
      return NextResponse.json(
        { error: { code: "not_found", message: "Link not found" } },
        { status: 404 }
      )
    }

    // 2. Delete from DB
    // onDelete: Cascade in schema means all Click rows are deleted too
    await prisma.link.delete({
      where: { slug },
    })

    // 3. CRITICAL: Invalidate Redis cache
    // Without this, the deleted link keeps redirecting for up to 24 hours
    await linkCache.delete(slug)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[DELETE /api/links/[slug]]", error)
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong" } },
      { status: 500 }
    )
  }
}
