import "../globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/wrapper/app-sidebar";
import Navbar from "@/components/wrapper/nav-bar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-[90dvh]">
        <Navbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
