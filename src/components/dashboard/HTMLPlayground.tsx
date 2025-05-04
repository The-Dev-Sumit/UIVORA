"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import Split from "react-split";
import { FaSave } from "react-icons/fa";
import { toast } from "react-hot-toast";
import TagSelectionModal, { ComponentTag } from "../TagSelectionModal";
import axios from "axios";
import { useRouter } from "next/navigation";

type CodeState = {
  html: string;
  css: string;
  js: string;
};

interface HTMLPlaygroundProps {
  useTailwind: boolean;
  language: "js" | "ts";
}

const HTMLPlayground = ({ useTailwind, language }: HTMLPlaygroundProps) => {
  const [code, setCode] = useState<CodeState>({
    html: "<h1>Hello World!</h1>",
    css: "h1 { color: blue; }",
    js:
      language === "ts"
        ? `interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "The Great Sumit",
  age: 23
};

console.log(user);`
        : `const user = {
  name: "The Great Sumit",
  age: 23
};

console.log(user);`,
  });

  const [activeEditor, setActiveEditor] = useState<"html" | "css" | "js">(
    "html"
  );
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async (selectedTag: ComponentTag) => {
    try {
      setIsSaving(true);
      const response = await axios.post("/api/user/components", {
        name: "HTML Component",
        type: "html",
        code: {
          html: code.html,
          css: useTailwind ? "" : code.css,
          js: code.js,
          language: language,
          useTailwind: useTailwind,
        },
        metadata: {
          type: "html",
          language: language,
          useTailwind: useTailwind,
          tag: selectedTag,
        },
      });

      if (response.status === 200) {
        toast.success("Component saved successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error saving component:", error);
      toast.error("Failed to save component");
    }
  };

  return (
    <div className="w-full h-full p-2">
      <Split
        className="flex h-full gap-2"
        sizes={[50, 50]}
        minSize={200}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize">
        {/* Left side - Code editor ka section */}
        <div className="h-[35rem] flex flex-col">
          <div className="bg-gray-800 rounded-t-lg text-white px-4 py-[4px] flex items-center gap-4">
            <button
              onClick={() => setActiveEditor("html")}
              className={`px-3 py-[3px] cursor-pointer rounded-3xl ${
                activeEditor === "html"
                  ? "bg-gray-950/45 text-amber-100/80"
                  : ""
              }`}>
              HTML
            </button>
            <button
              onClick={() => setActiveEditor("css")}
              className={`px-3 py-[3px] cursor-pointer rounded-3xl ${
                activeEditor === "css" ? "bg-gray-950/45 text-amber-100/80" : ""
              }`}>
              CSS
            </button>
            <button
              onClick={() => setActiveEditor("js")}
              className={`px-3 py-[3px] cursor-pointer rounded-3xl ${
                activeEditor === "js" ? "bg-gray-950/45 text-amber-100/80" : ""
              }`}>
              {language === "ts" ? "TypeScript" : "JavaScript"}
            </button>
          </div>
          <div className="flex-1 min-h-0">
            {activeEditor === "html" ? (
              <Editor
                height="100%"
                defaultLanguage="html"
                value={code.html}
                onChange={(value) => setCode({ ...code, html: value || "" })}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  lineNumbers: "on",
                }}
              />
            ) : activeEditor === "css" ? (
              <Editor
                height="100%"
                defaultLanguage="css"
                value={code.css}
                onChange={(value) => setCode({ ...code, css: value || "" })}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  lineNumbers: "on",
                }}
              />
            ) : (
              <Editor
                height="100%"
                defaultLanguage={
                  language === "ts" ? "typescript" : "javascript"
                }
                value={code.js}
                onChange={(value) => setCode({ ...code, js: value || "" })}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  lineNumbers: "on",
                }}
              />
            )}
          </div>
        </div>

        {/* Right side - Preview ka section */}
        <div className="h-[35rem]">
          <div className="h-full border rounded-lg bg-white overflow-hidden flex flex-col">
            <div className="bg-gray-800 text-white px-4 py-2 rounded-t-lg flex justify-between">
              <span>Preview </span>
              <button
                onClick={() => setIsTagModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer text-white ">
                <FaSave />
                Save
              </button>
            </div>
            <div className="flex-1">
              <iframe
                className="w-full h-full"
                srcDoc={`<!DOCTYPE html>
                  <html>
                    <head>
                      ${
                        useTailwind
                          ? '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>'
                          : ""
                      }
                      <style>
                          body {
                              margin: 0;
                              padding: 0;
                              width: 100%;
                              height: 100%;
                              box-sizing: border-box;
                            }
                        ${code.css}
                      </style>
                      ${
                        language === "ts"
                          ? '<script src="https://unpkg.com/typescript@latest/lib/typescriptServices.js"></script>'
                          : ""
                      }
                    </head>
                    <body>
                      ${code.html}
                      <script${
                        language === "ts" ? ' type="text/typescript"' : ""
                      }>
                        ${
                          language === "ts"
                            ? `
                            // TypeScript compilation
                            const tsCode = \`${code.js}\`;
                            const jsCode = ts.transpileModule(tsCode, {
                              compilerOptions: { target: ts.ScriptTarget.ES2015 }
                            }).outputText;
                            eval(jsCode);
                          `
                            : code.js
                        }
                      </script>
                    </body>
                  </html>
                `}
                title="Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </Split>

      <TagSelectionModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSelectTag={(selectedTag) => {
          setIsTagModalOpen(false);
        }}
      />
    </div>
  );
};

export default HTMLPlayground;
