import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "../ui/sidebar";
import { Textarea } from "../ui/textarea";

export default function ChatSideBar() {
    return (
        <Sidebar variant="floating" className="w-[400px]">
            <SidebarHeader />
            <SidebarContent></SidebarContent>
            <SidebarFooter>
                <Textarea placeholder="design a .." />
            </SidebarFooter>
        </Sidebar>
    )
}