"use client";

import type { LP } from "@/lib/schema";
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

export function LPPreview({ lp }: { lp: LP }) {
  const monthly = lp.brief.opportunityEurPerMonth;
  const annual = monthly * 12;
  const threeYear = monthly * 36;

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <span className="font-medium text-foreground">{lp.company.name}</span>
          <span>·</span>
          <span>{lp.company.domain}</span>
          <span>·</span>
          <span>{lp.company.industry}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
          <RichText text={lp.hero.headline} />
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          <RichText text={lp.hero.subhead} />
        </p>
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed">
          <span className="uppercase tracking-wider text-xs text-accent font-medium">
            Visible gap ·
          </span>{" "}
          <span className="text-foreground/90">
            <RichText text={lp.hero.painHook} />
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-5">
        {lp.sections.map((section, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <span className="gradient-text text-3xl font-semibold tabular-nums shrink-0 leading-none">
                0{i + 1}
              </span>
              <div className="flex flex-col gap-3 min-w-0">
                <h3 className="text-lg font-medium leading-snug">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <RichText text={section.body} />
                </p>
              </div>
            </div>
            <ul className="flex flex-col gap-2 pl-0 sm:pl-12 mt-1">
              {section.tactics.map((t, j) => (
                <li
                  key={j}
                  className="text-sm leading-relaxed flex gap-3 items-start rounded-lg bg-background/40 border border-border/50 px-3 py-2"
                >
                  <span className="gradient-text font-semibold shrink-0 tabular-nums text-xs leading-5 min-w-[1.5rem]">
                    {String(j + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground/90">
                    <RichText text={t} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-accent/30 bg-card p-6 flex flex-col gap-4">
        <h3 className="text-lg font-medium">{lp.ctaBlock.title}</h3>
        <ul className="flex flex-col gap-3">
          {lp.ctaBlock.bullets.map((b, i) => (
            <li
              key={i}
              className="text-sm leading-relaxed flex gap-3 items-start"
            >
              <span
                className="mt-0.5 shrink-0 w-5 h-5 rounded-full gradient-hero text-[10px] font-semibold flex items-center justify-center text-[#0a0b14] tabular-nums"
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="text-foreground/90">
                <RichText text={b} />
              </span>
            </li>
          ))}
        </ul>
        <button className="self-start mt-2 rounded-full gradient-hero text-[#0a0b14] px-6 py-2 text-sm font-semibold">
          {lp.ctaBlock.ctaLabel}
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Mini growth brief
          </span>
          <span className="text-xs text-muted-foreground">
            Directional · not audited
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold">{lp.brief.opportunityTitle}</h3>
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
            {lp.brief.keyMetrics.map((m, i) => (
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
          {lp.brief.rationaleBlocks.map((block, i) => (
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
            <RichText text={lp.brief.quickWin} />
          </p>
        </div>
      </div>

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
