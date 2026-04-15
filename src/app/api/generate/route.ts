import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const InputSchema = z.object({
  companyInput: z
    .string()
    .min(1, "companyInput is required")
    .max(200, "companyInput too long"),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400 }
    );
  }

  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "invalid_input",
        details: parsed.error.issues.map((i) => i.message),
      },
      { status: 400 }
    );
  }

  // H2 will replace this stub with the real AI pipeline.
  return NextResponse.json({
    status: "stub",
    companyInput: parsed.data.companyInput,
    note: "API pipeline is stubbed — H2 wires Anthropic + Gemini fallback.",
  });
}
