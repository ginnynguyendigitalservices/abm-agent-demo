import { z } from "zod";

export const CompanySchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().min(1).max(100),
  industry: z.string().min(1).max(120),
});

// ---------- Part 1: Personalised landing page (marketing voice TO prospect) ----------

export const LPHeroSchema = z.object({
  eyebrow: z.string().min(3).max(60),
  headline: z.string().min(20).max(160),
  subhead: z.string().min(30).max(240),
  ctaPrimary: z.string().min(3).max(50),
  ctaSecondary: z.string().min(3).max(50),
});

export const ValuePropSchema = z.object({
  title: z.string().min(3).max(60),
  body: z.string().min(40).max(240),
});

export const TrustBarSchema = z.object({
  headline: z.string().min(10).max(120),
  logos: z.array(z.string().min(2).max(40)).min(4).max(6),
});

export const FitSectionSchema = z.object({
  headline: z.string().min(10).max(140),
  body: z.string().min(60).max(360),
  fitBullets: z.array(z.string().min(10).max(200)).length(3),
});

export const ClosingCtaSchema = z.object({
  headline: z.string().min(10).max(160),
  body: z.string().min(40).max(280),
  ctaLabel: z.string().min(3).max(50),
});

export const LandingPageSchema = z.object({
  hero: LPHeroSchema,
  valueProps: z.array(ValuePropSchema).length(3),
  trustBar: TrustBarSchema,
  fitSection: FitSectionSchema,
  closingCta: ClosingCtaSchema,
});

// ---------- Part 2: Mini growth brief (audit voice FOR reviewer) ----------

export const KeyMetricSchema = z.object({
  label: z.string().min(2).max(40),
  value: z.string().min(1).max(40),
});

export const RationaleBlockSchema = z.object({
  title: z.string().min(3).max(60),
  bullets: z.array(z.string().min(5).max(320)).min(2).max(5),
});

export const GrowthBriefSchema = z.object({
  opportunityTitle: z.string().min(5).max(200),
  opportunityEurPerMonth: z.number().positive().max(10_000_000),
  keyMetrics: z.array(KeyMetricSchema).min(2).max(5),
  rationaleBlocks: z.array(RationaleBlockSchema).min(2).max(4),
  quickWin: z.string().min(50).max(800),
});

// ---------- Top level ----------

export const MetaSchema = z.object({
  provider: z.enum(["anthropic", "gemini"]),
  generatedAt: z.string(),
});

export const LPSchema = z.object({
  company: CompanySchema,
  landingPage: LandingPageSchema,
  growthBrief: GrowthBriefSchema,
  meta: MetaSchema,
});

export type LP = z.infer<typeof LPSchema>;
export type LandingPage = z.infer<typeof LandingPageSchema>;
export type GrowthBrief = z.infer<typeof GrowthBriefSchema>;
