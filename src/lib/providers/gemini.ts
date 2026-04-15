import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/prompts/system";
import { buildUserPrompt } from "@/lib/prompts/user";
import type { ProviderChunk } from "@/lib/providers/anthropic";

const MODEL_ID = "gemini-2.5-flash";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function* streamGemini({
  companyInput,
  signal,
}: {
  companyInput: string;
  signal: AbortSignal;
}): AsyncGenerator<ProviderChunk, void, void> {
  const model = genAI.getGenerativeModel({
    model: MODEL_ID,
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ googleSearch: {} } as unknown as never],
  });

  const result = await model.generateContentStream({
    contents: [
      {
        role: "user",
        parts: [{ text: buildUserPrompt(companyInput) }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 8192,
    },
  });

  for await (const chunk of result.stream) {
    if (signal.aborted) {
      throw new DOMException("aborted", "AbortError");
    }
    const text = chunk.text();
    if (text) {
      yield { kind: "text", text };
    }
  }
}
