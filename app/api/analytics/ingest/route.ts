import { NextRequest, NextResponse } from "next/server"
import { Receiver } from "@upstash/qstash"
import { z } from "zod"
import { ingestClick } from "@/lib/api/analytics/ingest-click"

const clickEventSchema = z.object({
  slug: z.string().min(1),
  country: z.string(),
  userAgent: z.string(),
  referrer: z.string(),
  timestamp: z.string(),
})

export async function POST(req: NextRequest) {
  // Validate signing keys are present before constructing Receiver
  const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY

  if (!currentSigningKey || !nextSigningKey) {
    console.error("[ingest] QSTASH signing keys are not set")
    return NextResponse.json(
      { error: { code: "internal_error", message: "Server misconfiguration" } },
      { status: 500 }
    )
  }

  // Receiver verifies that requests genuinely came from QStash
  const receiver = new Receiver({ currentSigningKey, nextSigningKey })

  try {
    const body = await req.text()
    const signature = req.headers.get("upstash-signature")

    if (!signature) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Missing signature" } },
        { status: 401 }
      )
    }

    const isValid = await receiver
      .verify({ signature, body, clockTolerance: 60 })
      .catch(() => false)

    if (!isValid) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Invalid signature" } },
        { status: 401 }
      )
    }

    // Validate payload shape with Zod before touching the DB
    let bodyJson: unknown
    try {
      bodyJson = JSON.parse(body)
    } catch {
      return NextResponse.json(
        { error: { code: "validation_error", message: "Request body is not valid JSON" } },
        { status: 400 }
      )
    }
    const parsed = clickEventSchema.safeParse(bodyJson)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "validation_error",
            message: parsed.error.issues[0].message,
          },
        },
        { status: 400 }
      )
    }

    await ingestClick(parsed.data)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("[POST /api/analytics/ingest]", error)
    // Return 500 so QStash retries the delivery
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong" } },
      { status: 500 }
    )
  }
}
