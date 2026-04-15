import type { Persona } from "@/lib/schema";

const PERSONA_DESCRIPTION: Record<Persona, string> = {
  marketing: "Marketing lead — cares about campaign velocity, ABM variants, LP iteration autonomy, brand consistency.",
  engineering: "Engineering lead — cares about stack integration, TypeScript safety, Next.js compatibility, Slice Machine DX, no CMS lock-in.",
  revenue: "Revenue/Sales lead — cares about pipeline, named-account targeting, conversion lift, SQL velocity, deal acceleration.",
  product: "Product lead — cares about content experimentation, LP-to-activation flows, localised onboarding, content as product.",
  finance: "Finance lead — cares about engineering cost offset, CAC recovery, revenue per campaign, conversion ROI.",
};

export function buildUserPrompt(companyInput: string, persona: Persona = "marketing"): string {
  return `Target company: ${companyInput}
Target persona on the LP: **${persona.toUpperCase()}** — ${PERSONA_DESCRIPTION[persona]}

Use web search to gather, in order of priority:
1. What they actually do — industry, core product, segment, rough employee count.
2. Homepage hero and positioning copy (1–2 direct quotes if you can see them).
3. Any visible signals about their stack or setup — CMS, website builder, analytics, CRO tools, ABM/enrichment tools, localization footprint.
4. One visible growth gap — weak SEO pages, thin PLG motion, no ABM instrumentation, paid efficiency ceiling, slow LP iteration, no localization on revenue-relevant markets, etc.
5. If possible, a rough deal size band (ACV or self-serve price) so the opportunity EUR figure is grounded.

Tailor Part 1 (landingPage) language to the ${persona} persona's concerns. Part 2 (growthBrief) is audit voice regardless of persona.

Return a single JSON object matching the schema. Keep Part 1 copy PUNCHY — keyword-led phrases, not sentences. No preamble, no markdown — JSON only.`;
}
