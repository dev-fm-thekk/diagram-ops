// components/ui/sidebar.tsx
import React from "react";

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="h-full bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <span className="truncate text-sm font-semibold tracking-tight">Project Explorer</span>
      </div>
      <div className="flex h-[calc(100%-3.5rem)] flex-col gap-3 p-4">
        {children || (
          <div className="h-full w-full rounded-lg border border-dashed border-sidebar-border/70 bg-sidebar-accent/30" />
        )}
      </div>
    </aside>
  );
}