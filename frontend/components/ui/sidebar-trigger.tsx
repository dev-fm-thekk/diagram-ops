// components/ui/sidebar-trigger.tsx
import { Columns2 } from "lucide-react";

interface SidebarTriggerProps {
  onClick?: () => void;
  isOpen?: boolean;
}

export function SidebarTrigger({ onClick, isOpen }: SidebarTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        isOpen
          ? "bg-accent text-foreground"
          : "bg-background text-muted-foreground hover:bg-accent"
      }`}
      aria-label="Toggle Sidebar"
    >
      <Columns2 size={18} />
    </button>
  );
}