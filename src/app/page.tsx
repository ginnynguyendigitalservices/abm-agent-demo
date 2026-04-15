import { GenerateForm } from "@/components/generate-form";
import { ExampleSwitcher } from "@/components/example-switcher";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-[880px] px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-medium tracking-tight">
            <span className="gradient-text font-semibold">abm-agent-demo</span>
            <span className="text-muted-foreground ml-2">by Ginny Nguyen</span>
          </span>
          <a
            href="https://www.linkedin.com/in/ginnynguyen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn →
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[880px] w-full px-6 py-16 flex-1 flex flex-col gap-16">
        {/* Hero */}
        <section className="flex flex-col gap-6">
          <Badge
            variant="outline"
            className="self-start border-accent/40 text-accent"
          >
            Built for Prismic · AI Solutions Engineer
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
            The self-serve{" "}
            <span className="gradient-text">aha moment</span>{" "}
            Prismic&rsquo;s ABM Landing Page Builder doesn&rsquo;t have.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Enter a company URL. Get a personalised landing page and a quantified
            growth brief, generated in ~10 seconds by a Prismic-Agents-style
            workflow.
          </p>
        </section>

        {/* Form */}
        <section className="flex flex-col gap-3">
          <GenerateForm />
          <p className="text-xs text-muted-foreground">
            Tip: try a mid-market B2B SaaS company (e.g. <code>linear.app</code>,{" "}
            <code>vercel.com</code>).
          </p>
        </section>

        {/* Pre-baked examples */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Or see a pre-generated example
          </h2>
          <ExampleSwitcher />
        </section>

        {/* Demo video (wired in H3) */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            30-second walkthrough
          </h2>
          <div className="aspect-video rounded-xl border border-border bg-card flex items-center justify-center">
            <span className="text-xs text-muted-foreground italic">
              [video embedded in H3]
            </span>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 mt-16">
        <div className="mx-auto max-w-[880px] px-6 py-8 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
          <span>
            Built with Next.js 16, Sonnet 4.6, Gemini 2.0 Flash. Rate-limited for
            cost.
          </span>
          <a
            href="mailto:ginny.nguyen.digitalservices@gmail.com"
            className="hover:text-foreground transition-colors"
          >
            ginny.nguyen.digitalservices@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
