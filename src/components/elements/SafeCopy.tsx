"use client";

import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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
        return component.code.jsx || "";
      case "tsx":
        return component.code.tsx || component.code.jsx || ""; // fallback to jsx if tsx not available
      default:
        return "";
    }
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
                <span className="text-sm text-green-600 font-semibold">{copyStatus}</span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeCopy;
