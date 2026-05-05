import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Separator } from "./ui/separator";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" />
                </div>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end text-[12px]">
                            <span className="font-medium leading-none">Shadcn</span>
                            <span className="text-muted-foreground">Pro Plan</span>
                        </div>
                        <Avatar className="h-8 w-8 border">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
}