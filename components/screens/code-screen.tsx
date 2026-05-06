'use client';

import { Editor } from "@monaco-editor/react";
import { useCode } from "@/hooks/use-code";

export default function CodeScreen() {
  const { code, setCode } = useCode();

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
        defaultLanguage="javascript" // or "html", "css", etc.
        defaultValue="// start coding..."
        value={code}
        theme="vs-dark" // Options: "vs-dark" | "light"
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true, // Crucial for resizing within your flex layout
        }}
      />
    </div>
  );
}