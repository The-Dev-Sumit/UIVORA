"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { LiveProvider, LiveError, LivePreview } from "react-live";
import Split from "react-split";
import { motion } from "framer-motion";
import gsap from "gsap";
import { createRoot } from "react-dom/client";
import { FaSave } from "react-icons/fa";
import { toast } from "react-hot-toast";
import TagSelectionModal, { ComponentTag } from "../TagSelectionModal";
import axios from "axios";
import { useRouter } from "next/navigation";

type CodeState = {
  jsx: string;
  css: string;
};

interface ReactPlaygroundProps {
  isTypeScript?: boolean;
  useTailwind: boolean;
}

const defaultJSXWithCSS = `
const App = () => {
  const [count, setCount] = useState(0);
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.to(buttonRef.current, {
      scale: count % 2 === 0 ? 1.1 : 1,
      duration: 0.3
    });
  }, [count]);

  return (
    <div className="counter-app">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="counter-title"
      >
        Animated Counter
      </motion.h1>
      
      <motion.p 
        className="counter-value"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3 }}
        key={count}
      >
        Count: {count}
      </motion.p>

      <div className="button-container">
        <motion.button 
          ref={buttonRef}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="counter-button"
          onClick={() => setCount(prev => prev + 1)}
        >
          Increment
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="counter-button-reset"
          onClick={() => setCount(0)}
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
};

render(<App />);
`;

const defaultJSXWithTailwind = `
const App = () => {
  const [count, setCount] = useState(0);
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.to(buttonRef.current, {
      scale: count % 2 === 0 ? 1.1 : 1,
      duration: 0.3
    });
  }, [count]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-gray-800"
      >
        Animated Counter
      </motion.h1>
      
      <motion.p 
        className="text-2xl text-gray-600"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3 }}
        key={count}
      >
        Count: {count}
      </motion.p>

      <div className="flex gap-4">
        <motion.button 
          ref={buttonRef}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transform transition-all"
          onClick={() => setCount(prev => prev + 1)}
        >
          Increment
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transform transition-all"
          onClick={() => setCount(0)}
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
};

render(<App />);
`;

const defaultTSXWithCSS = `
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className: string;
}

const AnimatedButton: React.FC<ButtonProps> = ({ onClick, children, className }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={className}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

const App: React.FC = () => {
  const [count, setCount] = React.useState<number>(0);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: count % 2 === 0 ? 1.1 : 1,
        duration: 0.3
      });
    }
  }, [count]);

  return (
    <div className="counter-app">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="counter-title"
      >
        Animated Counter
      </motion.h1>
      
      <motion.p 
        className="counter-value"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3 }}
        key={count}
      >
        Count: {count}
      </motion.p>

      <div className="button-container">
        <AnimatedButton 
          className="counter-button"
          onClick={() => setCount(prev => prev + 1)}
        >
          Increment
        </AnimatedButton>

        <AnimatedButton 
          className="counter-button-reset"
          onClick={() => setCount(0)}
        >
          Reset
        </AnimatedButton>
      </div>
    </div>
  );
};

render(<App />);
`;

const defaultTSXWithTailwind = `
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className: string;
}

const AnimatedButton: React.FC<ButtonProps> = ({ onClick, children, className }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={className}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

const App: React.FC = () => {
  const [count, setCount] = React.useState<number>(0);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: count % 2 === 0 ? 1.1 : 1,
        duration: 0.3
      });
    }
  }, [count]);

  return (
    <div className="flex flex-col items-center gap-6 p-8  bg-gray-50 rounded-lg shadow-md">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-gray-800"
      >
        Animated Counter
      </motion.h1>
      
      <motion.p 
        className="text-2xl text-gray-600"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3 }}
        key={count}
      >
        Count: {count}
      </motion.p>

      <div className="flex gap-4">
        <AnimatedButton 
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transform transition-all"
          onClick={() => setCount(prev => prev + 1)}
        >
          Increment
        </AnimatedButton>

        <AnimatedButton 
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transform transition-all"
          onClick={() => setCount(0)}
        >
          Reset
        </AnimatedButton>
      </div>
    </div>
  );
};

render(<App />);
`;

const defaultCSS = `/* Custom CSS ko yahan likho */
.counter-app {
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
}

.counter-title {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.counter-value {
  font-size: 1.8rem;
  color: #4a5568;
  margin-bottom: 2rem;
}

.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.counter-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.counter-button:hover {
  background-color: #3182ce;
  transform: translateY(-2px);
}

.counter-button-reset {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #f56565;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.counter-button-reset:hover {
  background-color: #e53e3e;
  transform: translateY(-2px);
}`;

const ReactPlayground = ({
  isTypeScript = false,
  useTailwind: initialUseTailwind = false,
}: ReactPlaygroundProps) => {
  const [code, setCode] = useState<CodeState>({
    jsx: isTypeScript
      ? initialUseTailwind
        ? defaultTSXWithTailwind
        : defaultTSXWithCSS
      : initialUseTailwind
      ? defaultJSXWithTailwind
      : defaultJSXWithCSS,
    css: defaultCSS,
  });

  const [activeEditor, setActiveEditor] = useState<"jsx" | "css">("jsx");
  const previewRef = React.useRef<HTMLDivElement>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const router = useRouter();

  // Update code when props change
  useEffect(() => {
    setCode((prev) => ({
      ...prev,
      jsx: isTypeScript
        ? initialUseTailwind
          ? defaultTSXWithTailwind
          : defaultTSXWithCSS
        : initialUseTailwind
        ? defaultJSXWithTailwind
        : defaultJSXWithCSS,
    }));
  }, [isTypeScript, initialUseTailwind]);

  const handleCodeChange = (value: string | undefined, type: "jsx" | "css") => {
    if (value) {
      setCode((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  // Create style tag for CSS
  useEffect(() => {
    const styleId = "playground-styles";
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = initialUseTailwind ? "" : code.css;

    return () => {
      if (styleTag && document.head.contains(styleTag)) {
        document.head.removeChild(styleTag);
      }
    };
  }, [code.css, initialUseTailwind]);

  const scope = {
    motion,
    gsap,
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
  };

  const handleSave = async (selectedTag: ComponentTag) => {
    try {
      const response = await axios.post("/api/user/components", {
        name: "React Component",
        type: "react",
        code: {
          jsx: code.jsx,
          css: initialUseTailwind ? "" : code.css,
          useTailwind: initialUseTailwind,
        },
        metadata: {
          type: "react",
          isTypeScript: isTypeScript,
          useTailwind: initialUseTailwind,
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
        {/* Left side - Code editor */}
        <div className="h-[35rem] flex flex-col">
          <div className="bg-gray-800 rounded-t-lg text-white px-4 py-2 flex items-center gap-4">
            <button
              onClick={() => setActiveEditor("jsx")}
              className={`px-3 py-[3px] cursor-pointer rounded-3xl ${
                activeEditor === "jsx" ? "bg-gray-950/45 text-amber-100/80" : ""
              }`}>
              {isTypeScript ? "TSX" : "JSX"}
            </button>
            {!initialUseTailwind && (
              <button
                onClick={() => setActiveEditor("css")}
                className={`px-3 py-[3px] cursor-pointer rounded-3xl ${
                  activeEditor === "css"
                    ? "bg-gray-950/45 text-amber-100/80"
                    : ""
                }`}>
                CSS
              </button>
            )}
          </div>
          <div className="flex-1 min-h-0">
            {activeEditor === "jsx" ? (
              <Editor
                height="100%"
                defaultLanguage={isTypeScript ? "typescript" : "javascript"}
                value={code.jsx}
                onChange={(value) => handleCodeChange(value, "jsx")}
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
                defaultLanguage="css"
                path="style.css"
                value={code.css}
                onChange={(value) => handleCodeChange(value, "css")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  lineNumbers: "on",
                  tabSize: 2,
                  autoIndent: "advanced",
                  formatOnType: true,
                  formatOnPaste: true,
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                }}
              />
            )}
          </div>
        </div>

        {/* Right side - Preview */}
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
            <div className="flex-1 bg-gray-100 flex flex-col">
              <div
                ref={previewRef}
                className="flex-1 bg-white rounded-lg shadow-lg ">
                <LiveProvider
                  key={code.jsx}
                  code={code.jsx}
                  scope={scope}
                  noInline={true}>
                  <LiveError className="text-red-500 mb-4" />
                  <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4 overflow-auto">
                    <div className="max-w-full max-h-full flex flex-col items-center justify-center">
                      <LivePreview />
                    </div>
                  </div>
                </LiveProvider>
              </div>
            </div>
          </div>
        </div>
      </Split>

      <TagSelectionModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSelectTag={handleSave}
      />
    </div>
  );
};

export default ReactPlayground;
