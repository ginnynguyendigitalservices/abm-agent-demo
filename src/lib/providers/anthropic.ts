import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/prompts/system";
import { buildUserPrompt } from "@/lib/prompts/user";

const MODEL_ID = "claude-sonnet-4-6";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ProviderChunk {
  kind: "text";
  text: string;
}

export async function* streamAnthropic({
  companyInput,
  signal,
}: {
  companyInput: string;
  signal: AbortSignal;
}): AsyncGenerator<ProviderChunk, void, void> {
  const stream = client.messages.stream(
    {
      model: MODEL_ID,
      max_tokens: 4096,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: buildUserPrompt(companyInput),
        },
      ],
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 3,
        },
      ],
    },
    { signal }
  );

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield { kind: "text", text: event.delta.text };
    }
  }
}
