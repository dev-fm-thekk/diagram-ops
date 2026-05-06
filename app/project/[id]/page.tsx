'use client'

import CodeScreen from "@/components/screens/code-screen";
import Sidebar from "@/components/ui/chat-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar-trigger";
import { useState } from "react";

export default function ProjectPage() {
    const [expand, setExpand] = useState(true);
    const [current, setCurrent] = useState(0)
  return (
    <main className="flex h-screen w-full bg-background font-sans text-foreground">
      <div className="flex w-full h-full flex-row">
        
        <div className={`transition-all duration-300 ease-in-out ${expand ? "w-md" : "w-0"} overflow-hidden`}>
           <Sidebar />
        </div>

        <div className="flex-1 flex flex-col h-full bg-background">
          
          <header className="flex items-center gap-4 px-4 h-14 border-b border-border">
            <SidebarTrigger onClick={() => setExpand(!expand)} isOpen={expand}/>

            <nav className="flex items-center bg-muted/50 p-1 rounded-[0.625rem] border border-border">
              <button 
                onClick={() => setCurrent(0)}
                className={`px-4 py-1.5 text-sm font-medium transition-all rounded-lg ${
                    current === 0 
                    ? "bg-background shadow-sm border border-border/50 text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Code
              </button>
              <button 
                onClick={() => setCurrent(1)}
                className={`px-4 py-1.5 text-sm font-medium transition-all rounded-lg ${
                    current === 1 
                    ? "bg-background shadow-sm border border-border/50 text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Preview
              </button>
            </nav>
          </header>

          <section className="flex-1 p-4 overflow-hidden">
            <div className="w-full h-full bg-card text-card-foreground border border-border rounded-[0.625rem] shadow-sm overflow-auto">
                {/* Conditional Rendering Logic */}
                {current === 0 ? (
                    <CodeScreen />
                ) : (
                    <div className="p-4">
                        {/* Replace this with your Preview Component */}
                        <h2 className="text-lg font-semibold">Live Preview</h2>
                        <p className="text-muted-foreground">Preview content will render here.</p>
                    </div>
                )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}