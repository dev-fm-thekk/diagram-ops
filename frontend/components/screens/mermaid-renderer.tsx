'use client';

import { useCode } from "@/hooks/use-code";
import mermaid from "mermaid";
import { useEffect, useId, useRef } from "react";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
});

export default function MermaidRenderer() {
  const ref = useRef<HTMLDivElement>(null);
  const { code } = useCode();
  const diagramId = useId();

  useEffect(() => {
    let cancelled = false;

    const renderDiagram = async () => {
      const el = ref.current;
      if (!el) return;

      try {
        const { svg } = await mermaid.render(
          `mermaid-${diagramId.replaceAll(":", "-")}`,
          code,
          el
        );
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled && ref.current) {
          ref.current.innerHTML =
            '<pre class="p-3 text-sm text-destructive">Invalid Mermaid syntax.</pre>';
        }
      }
    };

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, diagramId]);

  return <div className="h-full w-full" ref={ref} />;
}