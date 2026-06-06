## Add API Route
When I ask you to add an API route, create a new route.ts file at the path I specify.
The route must follow this exact pattern:

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  // fields go here
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "validation_error", message: parsed.error.message } },
        { status: 400 }
      )
    }
    // call a function from lib/ here, never put logic in this file
    return NextResponse.json({}, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong" } },
      { status: 500 }
    )
  }
}
