import { z } from "zod";

export const CompanySchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().min(1).max(100),
  industry: z.string().min(1).max(120),
});

export const HeroSchema = z.object({
  headline: z.string().min(10).max(200),
  subhead: z.string().min(10).max(300),
  painHook: z.string().min(10).max(300),
});

export const SectionSchema = z.object({
  title: z.string().min(3).max(120),
  body: z.string().min(30).max(700),
  tactics: z.array(z.string().min(10).max(300)).min(3).max(5),
});

export const CTABlockSchema = z.object({
  title: z.string().min(5).max(200),
  bullets: z.array(z.string().min(5).max(400)).length(3),
  ctaLabel: z.string().min(2).max(60),
});

export const KeyMetricSchema = z.object({
  label: z.string().min(2).max(40),
  value: z.string().min(1).max(40),
});

export const RationaleBlockSchema = z.object({
  title: z.string().min(3).max(60),
  bullets: z.array(z.string().min(5).max(320)).min(2).max(5),
});

export const BriefSchema = z.object({
  opportunityTitle: z.string().min(5).max(200),
  opportunityEurPerMonth: z.number().positive().max(10_000_000),
  keyMetrics: z.array(KeyMetricSchema).min(2).max(5),
  rationaleBlocks: z.array(RationaleBlockSchema).min(2).max(4),
  quickWin: z.string().min(50).max(800),
});

export const MetaSchema = z.object({
  provider: z.enum(["anthropic", "gemini"]),
  generatedAt: z.string(),
});

export const LPSchema = z.object({
  company: CompanySchema,
  hero: HeroSchema,
  sections: z.array(SectionSchema).length(3),
  ctaBlock: CTABlockSchema,
  brief: BriefSchema,
  meta: MetaSchema,
});

export type LP = z.infer<typeof LPSchema>;

export type LPWithoutMeta = Omit<LP, "meta">;
