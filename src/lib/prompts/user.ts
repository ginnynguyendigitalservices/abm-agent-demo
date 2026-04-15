export function buildUserPrompt(companyInput: string): string {
  return `Target company: ${companyInput}

Use web search to gather, in order of priority:
1. What they actually do — industry, core product, segment, rough employee count.
2. Homepage hero and positioning copy (1–2 direct quotes if you can see them).
3. Any visible signals about their stack or setup — CMS, website builder, analytics, CRO tools, ABM/enrichment tools, localization footprint.
4. One visible growth gap — weak SEO pages, thin PLG motion, no ABM instrumentation, paid efficiency ceiling, slow LP iteration, no localization on revenue-relevant markets, etc.
5. If possible, a rough deal size band (ACV or self-serve price) so the opportunity EUR figure is grounded.

Then return the personalised LP + brief as a single JSON object matching the schema. No preamble, no markdown — JSON only.`;
}
