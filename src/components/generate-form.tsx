"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function GenerateForm() {
  const [companyInput, setCompanyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyInput.trim()) {
      toast.error("Enter a company URL or name");
      return;
    }
    setLoading(true);
    setResult(null);
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
      const body = await res.json();
      setResult(JSON.stringify(body, null, 2));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
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
      {result && (
        <pre className="rounded-lg border border-border bg-card p-4 text-xs overflow-auto max-h-80">
          {result}
        </pre>
      )}
    </div>
  );
}
