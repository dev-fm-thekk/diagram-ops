"use client";

import CodeScreen from "@/components/screens/code-screen";
import MermaidRenderer from "@/components/screens/mermaid-renderer";
import Sidebar from "@/components/ui/chat-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar-trigger";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import { useState } from "react";

export default function ProjectPage() {
  const [expand, setExpand] = useState(true);
  const [current, setCurrent] = useState(0);

  // Functional update ensures you're always toggling the LATEST state
  const toggleSidebar = () => setExpand((prev) => !prev);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside
        className={`shrink-0 overflow-hidden border-r border-border bg-sidebar transition-all duration-300 ease-in-out ${
          expand ? "w-80" : "w-0"
        }`}
      >
        <div className="w-80 h-full">
          <Sidebar />
        </div>
      </aside>

      <div className="relative flex h-full min-w-0 flex-1 flex-col bg-background">
        <header className="flex h-14 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger onClick={toggleSidebar} isOpen={expand} />

          <nav className="flex items-center rounded-md border border-border bg-muted/60 p-1">
            <button
              onClick={() => setCurrent(0)}
              className={`rounded-sm px-4 py-1.5 text-sm font-medium transition-colors ${
                current === 0
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setCurrent(1)}
              className={`rounded-sm px-4 py-1.5 text-sm font-medium transition-colors ${
                current === 1
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Preview
            </button>
          </nav>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <section className="flex-1 overflow-hidden p-4">
          <div className="h-full w-full rounded-lg border border-border bg-card shadow-sm">
            {current === 0 ? (
              <CodeScreen />
            ) : (
              <MermaidRenderer />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
