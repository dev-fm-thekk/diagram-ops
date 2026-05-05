import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BreadCrumbNav from "./bread-crumb-nav";

const projects: Record<string, string> = {
  1: "septum sempra",
  2: "Avada kadavra",
};

export default function CodePreviewSection({
  code,
  projectId,
}: {
  code: string;
  projectId: number;
}) {
  const projectName = projects[projectId];
  return (
    <Tabs defaultValue="preview" className="w-full h-full flex flex-col">
      {/* 1. The Controller (Your Header) */}
      <header className="flex h-14 align-center gap-16 justify-start items-center px-4 border-b bg-background">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
        <BreadCrumbNav projectName={projectName} />

        <TabsList className="grid w-[200px] grid-cols-2">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </header>

      {/* 2. The Content Areas */}
      <div className="flex-1 overflow-hidden">
        <TabsContent value="code" className="h-full m-0">
          <ScrollArea className="h-full w-full bg-zinc-950 text-zinc-50">
            <pre className="p-4 font-mono text-sm">
              <code>{code}</code>
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="preview"
          className="h-full m-0 bg-slate-50 dark:bg-zinc-900"
        >
          {/* If rendering external HTML/React, use an iframe or a runner here */}
          <div className="flex h-full items-center justify-center p-4">
            <div className="w-full h-full border rounded-lg bg-white shadow-sm overflow-auto">
              {/* Your rendered component goes here */}
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
