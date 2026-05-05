import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function Hero() {
  return (
    <section className="w-1/2 h-[90dvh] mx-auto flex flex-col gap-4 justify-center">
      <h1 className="text-center text-2xl">Diagram-ops Prompt you diagrams</h1>
      <div className="relative w-full">
        <Textarea
          placeholder="Type something..."
          className="pr-12 resize-none"
        />

        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-2 h-8 w-8"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
