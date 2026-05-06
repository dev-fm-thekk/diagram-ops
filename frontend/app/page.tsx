import Link from "next/link";
import { ThemeToggle } from "@/components/ui/toggle-theme";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-end p-4">
        <ThemeToggle />
      </div>

      <section className="mx-auto flex min-h-[calc(100vh-4.5rem)] w-full max-w-5xl items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-xl border border-border bg-card p-8 text-card-foreground shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight">Diagram Ops</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Build and preview diagram code with a clean light and dark interface.
          </p>
          <div className="mt-6">
            <Link
              href="/project/1"
              className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              Open Project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
