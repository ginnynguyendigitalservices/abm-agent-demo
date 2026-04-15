"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { LPPreview } from "@/components/lp-preview";
import type { LP } from "@/lib/schema";

const RESULT_DELIM = "\n---RESULT---\n";
const ERROR_DELIM = "\n---ERROR---\n";
const PROVIDER_RE = /\n---PROVIDER:(anthropic|gemini)---\n/g;

type Status = "idle" | "researching" | "generating" | "done" | "error";

export function GenerateForm() {
  const [companyInput, setCompanyInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [lp, setLp] = useState<LP | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyInput.trim()) {
      toast.error("Enter a company URL or name");
      return;
    }

    setStatus("researching");
    setActiveProvider(null);
    setLp(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyInput: companyInput.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }

      if (!res.body) throw new Error("no response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        const providerMatches = [...accumulated.matchAll(PROVIDER_RE)];
        if (providerMatches.length > 0) {
          const last = providerMatches[providerMatches.length - 1][1];
          setActiveProvider(last);
          setStatus("generating");
        }
      }

      if (accumulated.includes(ERROR_DELIM)) {
        const errJson = accumulated.split(ERROR_DELIM)[1].trim();
        const err = JSON.parse(errJson);
        throw new Error(err.message ?? "pipeline failed");
      }

      if (!accumulated.includes(RESULT_DELIM)) {
        throw new Error("no result block in stream");
      }

      const resultJson = accumulated.split(RESULT_DELIM)[1].trim();
      const parsed = JSON.parse(resultJson);
      if (!parsed.ok) {
        throw new Error(parsed.message ?? "pipeline returned ok=false");
      }

      setLp(parsed.lp as LP);
      setStatus("done");
      toast.success(`Generated via ${parsed.provider} in ${Math.round(parsed.latencyMs / 100) / 10}s`);
    } catch (err) {
      setStatus("error");
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const loading = status === "researching" || status === "generating";

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          value={companyInput}
          onChange={(e) => setCompanyInput(e.target.value)}
          placeholder="e.g. linear.app"
          className="h-12 text-base flex-1"
          disabled={loading}
          aria-label="Company URL or name"
        />
        <Button
          type="submit"
          disabled={loading}
          className="h-12 px-8 font-medium gradient-hero text-[#0a0b14] hover:opacity-90 border-0"
        >
          {loading ? "Generating..." : "Generate demo"}
        </Button>
      </form>

      {loading && (
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card/50 p-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>
              {status === "researching"
                ? `Researching ${companyInput.trim()}...`
                : `Drafting with ${activeProvider ?? "AI"}...`}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="grid gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      )}

      {lp && status === "done" && <LPPreview lp={lp} />}
    </div>
  );
}
