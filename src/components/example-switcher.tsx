"use client";

import { useState } from "react";
import { LPPreview } from "@/components/lp-preview";
import type { LP } from "@/lib/schema";
import linearFixture from "@/lib/fixtures/linear.json";
import vercelFixture from "@/lib/fixtures/vercel.json";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  { key: "linear", label: "Linear", domain: "linear.app", lp: linearFixture as unknown as LP },
  { key: "vercel", label: "Vercel", domain: "vercel.com", lp: vercelFixture as unknown as LP },
] as const;

type ExampleKey = (typeof EXAMPLES)[number]["key"];

export function ExampleSwitcher() {
  const [active, setActive] = useState<ExampleKey | null>(null);

  const activeExample = EXAMPLES.find((e) => e.key === active);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.key}
            type="button"
            onClick={() => setActive(ex.key === active ? null : ex.key)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
              "flex items-center gap-2",
              active === ex.key
                ? "border-accent/60 bg-accent/10 text-foreground"
                : "border-border bg-card/50 text-muted-foreground hover:border-accent/40 hover:text-foreground"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                active === ex.key ? "bg-accent" : "bg-muted-foreground"
              )}
            />
            <span>See demo for {ex.label}</span>
            <span className="text-muted-foreground">· {ex.domain}</span>
          </button>
        ))}
      </div>

      {activeExample && (
        <div className="flex flex-col gap-6 rounded-xl border border-border/60 bg-card/30 p-6">
          <div className="text-xs text-muted-foreground">
            Pre-generated fixture · zero API call · click pill again to hide
          </div>
          <LPPreview lp={activeExample.lp} />
        </div>
      )}
    </div>
  );
}
