import { Leaf, LockKeyhole, Ruler } from "lucide-react";

import { ShellMark } from "@/components/app/shell-mark";
import { getMessages } from "@/lib/i18n/messages";

const messages = getMessages();
const principleIcons = {
  local: LockKeyhole,
  flexible: Ruler,
  growth: Leaf,
};

export default function Home() {
  return (
    <main className="relative isolate flex min-h-dvh items-center overflow-hidden px-5 py-12 sm:px-8">
      <div
        className="shell-pattern absolute inset-0 -z-10 opacity-45"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-5xl animate-fade-up">
        <header className="mb-12 flex items-center gap-3 sm:mb-16">
          <ShellMark className="size-11" />
          <div>
            <p className="font-display text-xl font-bold tracking-tight text-primary">
              {messages.common.appName}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {messages.common.tagline}
            </p>
          </div>
        </header>

        <section className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
            {messages.home.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-primary sm:text-6xl">
            {messages.home.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {messages.home.introduction}
          </p>
        </section>

        <section
          className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-3"
          aria-label={messages.home.principlesLabel}
        >
          {messages.home.principles.map((principle, index) => {
            const Icon = principleIcons[principle.id];

            return (
              <article
                className="rounded-lg border border-border/80 bg-card/90 p-6 shadow-[0_2px_8px_rgba(27,48,34,0.04)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-ambient motion-reduce:transform-none"
                key={principle.id}
                style={{ animationDelay: `${120 + index * 90}ms` }}
              >
                <span className="mb-5 grid size-10 place-items-center rounded-md bg-accent text-accent-foreground">
                  <Icon
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.8}
                  />
                </span>
                <h2 className="font-display text-lg font-semibold text-card-foreground">
                  {principle.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {principle.description}
                </p>
              </article>
            );
          })}
        </section>

        <footer className="mt-12 border-t border-border/70 pt-5 text-sm text-muted-foreground sm:mt-16">
          {messages.home.footer}
        </footer>
      </div>
    </main>
  );
}
