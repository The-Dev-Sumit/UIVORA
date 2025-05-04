"use client";

import { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

interface SafeCopyProps {
  component: {
    name: string;
    type: "html" | "react";
    code: {
      html?: string;
      css?: string;
      js?: string;
      jsx?: string;
      tsx?: string;
      useTailwind?: boolean;
    };
  };
}

const SafeCopy = ({ component }: SafeCopyProps) => {
  const [activeTab, setActiveTab] = useState<string>(
    component.type === "html" ? "html" : "jsx"
  );
  const [copyStatus, setCopyStatus] = useState<string>("");

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("code copied");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (error) {
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const getCode = () => {
    switch (activeTab) {
      case "html":
        return component.code.html || "";
      case "css":
        return component.code.css || "";
      case "js":
        return component.code.js || "";
      case "jsx":
        return `import React from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import styled from 'styled-components';

${component.code.jsx || ""}

export default App;`;
      case "tsx":
        return `import React from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import styled from 'styled-components';

${component.code.tsx || component.code.jsx || ""}

export default App;`;
      default:
        return "";
    }
  };

  const DynamicPreview = ({ code }: { code: string }) => {
    const [Component, setComponent] = useState<React.ComponentType | null>(
      null
    );
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const loadComponent = async () => {
        try {
          // Create a blob URL for the component code
          const blob = new Blob(
            [
              `
            import React from 'react';
            import { motion } from 'framer-motion';
            import gsap from 'gsap';
            import styled from 'styled-components';
            
            const App = () => {
              return (
                <div style={{ margin: 0, padding: 0 }}>
                  ${code}
                </div>
              );
            };
            
            export default App;
          `,
            ],
            { type: "text/javascript" }
          );

          const url = URL.createObjectURL(blob);

          // Dynamically import the component
          const module = await import(/* @vite-ignore */ url);
          setComponent(() => module.default);
          setError(null);

          // Cleanup
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Error loading component:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load component"
          );
        }
      };

      loadComponent();
    }, [code]);

    if (error) {
      return <div className="text-red-500 p-4">{error}</div>;
    }

    if (!Component) {
      return <div className="text-gray-500 p-4">Loading component...</div>;
    }

    return <Component />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">{component.name}</h1>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-6">
            {component.type === "html" ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("html")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "html"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  title="View HTML code">
                  HTML
                </motion.button>
                {component.code.css && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("css")}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === "css"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    title="View CSS code">
                    CSS
                  </motion.button>
                )}
                {component.code.js && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("js")}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === "js"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    title="View JavaScript code">
                    JavaScript
                  </motion.button>
                )}
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("jsx")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "jsx"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  title="View JSX code">
                  JSX
                </motion.button>
                {component.code.tsx && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("tsx")}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === "tsx"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    title="View TSX code">
                    TSX
                  </motion.button>
                )}
                {component.code.css && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("css")}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === "css"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    title="View CSS code">
                    CSS
                  </motion.button>
                )}
              </>
            )}
          </div>

          <div className="relative">
            <pre className="bg-gray-50 p-6 rounded-lg overflow-x-auto text-sm">
              <code className="language-javascript">{getCode()}</code>
            </pre>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCopy(getCode())}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 bg-white rounded-md shadow-sm flex items-center gap-2"
              title="Copy code">
              <FaCopy />
              {copyStatus && (
                <span className="text-sm text-green-600 font-semibold">
                  {copyStatus}
                </span>
              )}
            </motion.button>
          </div>

          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white px-4 py-2">
              <h2 className="text-lg font-semibold">Preview</h2>
            </div>
            <div className="h-96">
              {component.type === "html" ? (
                <iframe
                  className="w-full h-full"
                  title={`${component.name} preview`}
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <style>
                          body {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                          }
                          ${component.code.css || ""}
                        </style>
                        ${
                          component.code.useTailwind
                            ? '<script async src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>'
                            : ""
                        }
                      </head>
                      <body>
                        
                          ${component.code.html || ""}
                          
                        <script>${component.code.js || ""}</script>
                      </body>
                    </html>
                  `}
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="w-full h-full overflow-hidden bg-white">
                  {component.code.useTailwind && (
                    <script
                      async
                      src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                  )}
                  {!component.code.useTailwind && component.code.css && (
                    <style>{component.code.css}</style>
                  )}
                  <DynamicPreview code={component.code.jsx || ""} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeCopy;
