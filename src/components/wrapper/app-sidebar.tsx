'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Folder,
  FileText,
  Palette,
  ChevronDown,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const chats = [
  { text: "Hey, I want to build a web-app..." },
  { text: "Dashboard ideas" },
  { text: "Auth flow help" },
  { text: "Deploy Next.js app" },
  { text: "More chat..." },
];

const favorites = [
  { text: "UML Diagrams" },
  { text: "System Design" },
  { text: "UI Inspirations" },
  { text: "Backend Patterns" },
  { text: "Architecture Notes" },
];

export function AppSidebar() {
  const [openChats, setOpenChats] = useState(true);
  const [openFavs, setOpenFavs] = useState(true);

  return (
    <Sidebar>

      {/* HEADER */}
      <SidebarHeader className="my-4">
        <Button className="w-full">New Chat</Button>
      </SidebarHeader>

      <SidebarContent>

        {/* STATIC MENU */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Folder className="mr-2 h-4 w-4" />
              Projects
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton>
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton>
              <Palette className="mr-2 h-4 w-4" />
              Designs
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* CHATS */}
        <SidebarGroup>
          <SidebarGroupLabel
            className="flex cursor-pointer items-center"
            onClick={() => setOpenChats((v) => !v)}
          >
            Chats
            <ChevronDown
              className={`ml-auto h-4 w-4 transition-transform ${
                openChats ? "rotate-180" : ""
              }`}
            />
          </SidebarGroupLabel>

          {openChats && (
            <SidebarGroupContent>
              <SidebarMenu>
                {chats.slice(0, 3).map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton>
                      {item.text}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                  <SidebarMenuButton variant="default" className="text-muted-foreground">
                    More
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* FAVORITES (same behavior as Chats) */}
        <SidebarGroup>
          <SidebarGroupLabel
            className="flex cursor-pointer items-center"
            onClick={() => setOpenFavs((v) => !v)}
          >
            Favorites
            <ChevronDown
              className={`ml-auto h-4 w-4 transition-transform ${
                openFavs ? "rotate-180" : ""
              }`}
            />
          </SidebarGroupLabel>

          {openFavs && (
            <SidebarGroupContent>
              <SidebarMenu>
                {favorites.slice(0, 3).map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton>
                      {item.text}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                  <SidebarMenuButton className="text-muted-foreground">
                    More
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <Button variant="outline" className="w-full">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </SidebarFooter>

    </Sidebar>
  );
}