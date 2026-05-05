import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import "../../globals.css";
import ChatSidebar from "@/components/wrapper/chat-sidebar";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "400px", // Define your custom width here
        } as React.CSSProperties
      }
    >
      <ChatSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main className="min-h-[90dvh] w-full">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
