import { GenerateForm } from "@/components/generate-form";
import { ExampleSwitcher } from "@/components/example-switcher";
import { AvatarChip } from "@/components/avatar-chip";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-[880px] px-6 h-14 flex items-center justify-between gap-3">
          <span className="text-sm font-medium tracking-tight truncate">
            <span className="gradient-text font-semibold">abm-agent-demo</span>
            <span className="text-muted-foreground ml-2 hidden sm:inline">
              by Ginny Nguyen
            </span>
          </span>
          <a
            href="https://www.linkedin.com/in/ginnynguyen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-border bg-card/50 pl-1 pr-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors"
          >
            <AvatarChip size={26} />
            <span className="font-medium">Contact me on LinkedIn</span>
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
            Skip the sales call. See the{" "}
            <span className="gradient-text">aha moment</span> live.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Paste a company URL. Get the personalised landing page Prismic&rsquo;s
            ABM Agent would ship for them, plus a quantified growth brief.
            In your browser, in about a minute.
          </p>
        </section>

        {/* Form */}
        <section className="flex flex-col gap-3">
          <GenerateForm />
          <p className="text-xs text-muted-foreground">
            Tip: try a mid-market B2B SaaS (e.g. <code>linear.app</code>,{" "}
            <code>vercel.com</code>). Pick a persona to shape the LP voice.
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
              [video embedded in H4]
            </span>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="rounded-2xl gradient-border p-[1.5px]">
          <div className="rounded-2xl bg-card p-8 sm:p-10 flex flex-col items-center text-center gap-5">
            <AvatarChip size={64} />
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight max-w-xl">
              Like what you see?
            </h2>
            <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
              I&rsquo;m Ginny, a growth marketer who ships AI agents instead of
              briefs. This is one of them. If you find it interesting,
              let&rsquo;s talk.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://www.linkedin.com/in/ginnynguyen"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full gradient-hero text-[#0a0b14] px-6 py-3 text-sm font-semibold"
              >
                Reach out on LinkedIn
              </a>
              <a
                href="mailto:ginny.nguyen.digitalservices@gmail.com"
                className="rounded-full border border-border bg-card/50 text-foreground px-6 py-3 text-sm font-medium hover:border-accent/40"
              >
                Send an email
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
