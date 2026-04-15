"use client";

import type { LP, LandingPage, GrowthBrief } from "@/lib/schema";
import { Fragment } from "react";

function formatEur(n: number): string {
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `€${Math.round(n / 1_000)}K`;
  return `€${n}`;
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*\n]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**") && p.length > 4) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {p.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

function LandingPagePreview({ lp }: { lp: LandingPage }) {
  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-5 items-start">
        <span className="self-start rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] uppercase tracking-wider text-accent font-medium">
          {lp.hero.eyebrow}
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
          <span className="gradient-text">{lp.hero.headline}</span>
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
          {lp.hero.subhead}
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          <button className="rounded-full gradient-hero text-[#0a0b14] px-6 py-3 text-sm font-semibold">
            {lp.hero.ctaPrimary}
          </button>
          <button className="rounded-full border border-border bg-card/50 text-foreground px-6 py-3 text-sm font-medium hover:border-accent/40">
            {lp.hero.ctaSecondary}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {lp.valueProps.map((vp, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
          >
            <span className="gradient-text text-xs font-bold tracking-widest">
              0{i + 1}
            </span>
            <h3 className="text-base font-semibold leading-snug">{vp.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {vp.body}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 items-center text-center">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {lp.trustBar.headline}
        </span>
        <div className="flex flex-wrap gap-2 justify-center">
          {lp.trustBar.logos.map((logo, i) => (
            <span
              key={i}
              className="rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-muted-foreground"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 rounded-xl border border-border bg-card p-6">
        <div className="lg:col-span-3 flex flex-col gap-3">
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight leading-snug">
            {lp.fitSection.headline}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {lp.fitSection.body}
          </p>
        </div>
        <ul className="lg:col-span-2 flex flex-col gap-2 self-start">
          {lp.fitSection.fitBullets.map((b, i) => (
            <li
              key={i}
              className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm leading-relaxed flex gap-2 items-start"
            >
              <span className="text-accent shrink-0 mt-0.5" aria-hidden>
                ✓
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl gradient-border p-[1.5px]">
        <div className="rounded-2xl bg-card p-8 flex flex-col gap-4 items-center text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight max-w-2xl">
            {lp.closingCta.headline}
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
            {lp.closingCta.body}
          </p>
          <button className="rounded-full gradient-hero text-[#0a0b14] px-8 py-3 text-sm font-semibold mt-2">
            {lp.closingCta.ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function GrowthBriefPreview({ brief }: { brief: GrowthBrief }) {
  const monthly = brief.opportunityEurPerMonth;
  const annual = monthly * 12;
  const threeYear = monthly * 36;

  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold">{brief.opportunityTitle}</h3>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="gradient-text text-4xl sm:text-5xl font-bold tabular-nums leading-none">
            {formatEur(monthly)}
          </span>
          <span className="text-sm text-muted-foreground">/ month</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-border bg-background/40 px-3 py-2 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Monthly
            </span>
            <span className="text-sm font-semibold tabular-nums">
              {formatEur(monthly)}
            </span>
          </div>
          <div className="rounded-lg border border-border bg-background/40 px-3 py-2 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Annual
            </span>
            <span className="text-sm font-semibold tabular-nums">
              {formatEur(annual)}
            </span>
          </div>
          <div className="rounded-lg border border-border bg-background/40 px-3 py-2 flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              3-year
            </span>
            <span className="text-sm font-semibold tabular-nums">
              {formatEur(threeYear)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Key inputs
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {brief.keyMetrics.map((m, i) => (
            <div
              key={i}
              className="rounded-lg border border-border/60 bg-background/30 px-3 py-2 flex flex-col gap-0.5"
            >
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {m.label}
              </span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {brief.rationaleBlocks.map((block, i) => (
          <div
            key={i}
            className="rounded-lg border border-border/60 bg-background/30 p-4 flex flex-col gap-2"
          >
            <h4 className="text-sm font-medium text-foreground">
              {block.title}
            </h4>
            <ul className="flex flex-col gap-1.5">
              {block.bullets.map((b, j) => (
                <li
                  key={j}
                  className="text-sm text-muted-foreground leading-relaxed flex gap-2 items-start"
                >
                  <span className="text-accent shrink-0 mt-0.5" aria-hidden>
                    →
                  </span>
                  <span>
                    <RichText text={b} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-[#10b981]/30 bg-[#10b981]/5 p-4 flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-[#10b981] font-medium">
          Quick win — ship this week
        </span>
        <p className="text-sm leading-relaxed">
          <RichText text={brief.quickWin} />
        </p>
      </div>
    </div>
  );
}

export function LPPreview({ lp }: { lp: LP }) {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <span className="font-medium text-foreground">{lp.company.name}</span>
        <span>·</span>
        <span>{lp.company.domain}</span>
        <span>·</span>
        <span>{lp.company.industry}</span>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full gradient-hero" aria-hidden />
          <span className="gradient-text font-semibold">
            Part 1 · Personalised landing page
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Marketing copy the ABM Agent would serve to this prospect
        </span>
      </div>

      <LandingPagePreview lp={lp.landingPage} />

      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-border/60 pb-3 mt-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#10b981" }}
            aria-hidden
          />
          <span className="font-semibold" style={{ color: "#10b981" }}>
            Part 2 · Mini growth brief
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Directional opportunity sizing · not audited
        </span>
      </div>

      <GrowthBriefPreview brief={lp.growthBrief} />

      <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
        <span>Generated via</span>
        <code className="rounded bg-card px-1.5 py-0.5 text-foreground">
          {lp.meta.provider}
        </code>
        <span>·</span>
        <time dateTime={lp.meta.generatedAt}>
          {new Date(lp.meta.generatedAt).toLocaleString()}
        </time>
      </div>
    </div>
  );
}
