// components/ui/sidebar-trigger.tsx
import { Columns2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface SidebarTriggerProps {
  onClick?: () => void;
  isOpen?: boolean;
}

export function SidebarTrigger({ onClick, isOpen }: SidebarTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2  border-border transition-all hover:bg-accent group ${
        isOpen ? "text-foreground bg-accent" : "text-muted-foreground bg-transparent"
      }`}
      aria-label="Toggle Sidebar"
    >
      <Columns2 
        size={18} 
      />
    </button>
  );
}