'use client';

import { Editor } from "@monaco-editor/react";
import { useCode } from "@/hooks/use-code";
import { useTheme } from "@/hooks/use-theme";

export default function CodeScreen() {
  const { code, setCode } = useCode();
  const { resolvedTheme } = useTheme();

  const handleEditorChange = (value: string | undefined) => {
    // Monaco returns the full value string on every change
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="mermaid"
        defaultValue="graph TD;
        A-->B;
        A-->C;
        B-->D;
        C-->D;"
        value={code}
        theme={resolvedTheme === "light" ? "light" : "vs-dark"}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 }
        }}
      />
    </div>
  );
}