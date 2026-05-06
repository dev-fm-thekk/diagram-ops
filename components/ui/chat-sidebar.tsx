// components/ui/sidebar.tsx
import React from "react";

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  return (
    <aside className={`h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all ease-in-out duration-300`}>
      <div className="flex items-center h-14 px-4 border-b border-sidebar-border">
        <span className="text-sm font-semibold text-sidebar-foreground truncate">
          Project Explorer
        </span>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2">
        {children || (
          <div className="w-full h-full rounded-[0.625rem] border border-dashed border-sidebar-border/60 bg-sidebar-accent/20" />
        )}
      </div>
    </aside>
  );
}