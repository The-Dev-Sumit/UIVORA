"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUser, FaCalendar } from "react-icons/fa";
import { BiCopy } from "react-icons/bi";
import { IoArrowBackSharp } from "react-icons/io5";
import Link from "next/link";
import Loader from "@/components/loader/Loader";
import axios from "axios";
import gsap from "gsap";
import Image from "next/image";

interface Component {
  _id: string;
  name: string;
  type: "html" | "react";
  code: {
    html?: string;
    css?: string;
    js?: string;
    jsx?: string;
    tsx?: string;
  };
  createdAt: string;
  updatedAt: string;
  username: string;
  userImage: string;
  userName: string;
  metadata?: {
    language?: string;
    useTailwind?: boolean;
    isTypeScript?: boolean;
  };
}

const ComponentDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [component, setComponent] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "html" | "css" | "js" | "ts" | "jsx" | "tsx"
  >("html");
  const [showCode, setShowCode] = useState(true);
  const [copyStatus, setCopyStatus] = useState<string>("");

  const handleBack = () => router.back();

  useEffect(() => {
    fetchComponent();
  }, [params.id]);

  useEffect(() => {
    if (component) {
      if (component.type === "react") {
        if (
          component.metadata?.isTypeScript ||
          component.metadata?.language === "ts"
        ) {
          setActiveTab("tsx");
        } else {
          setActiveTab("jsx");
        }
      } else if (component.type === "html") {
        setActiveTab("html");
      }
    }
  }, [component]);

  const fetchComponent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/components/${params.id}`);

      if (response.status === 200) {
        setComponent(response.data);
      } else {
        setError(response.data.error || "Failed to load component");
      }
    } catch (error) {
      console.error("Error fetching component:", error);
      setError("Failed to load component");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyActiveTabCode = async () => {
    if (!component) return;

    let codeToCopy = "";
    if (component.type === "html") {
      switch (activeTab) {
        case "html":
          codeToCopy = component.code.html || "";
          break;
        case "css":
          codeToCopy = component.code.css || "";
          break;
        case "js":
        case "ts":
          codeToCopy = component.code.js || "";
          break;
      }
    } else {
      switch (activeTab) {
        case "jsx":
          codeToCopy = component.code.jsx || "";
          break;
        case "tsx":
          codeToCopy = component.code.tsx || "";
          break;
        case "css":
          codeToCopy = component.code.css || "";
          break;
      }
    }

    try {
      await navigator.clipboard.writeText(codeToCopy);
      setCopyStatus("code copied");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (error) {
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <Loader />
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-gray-600 mb-4">{error || "Component not found"}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Go Back
        </button>
      </div>
    );
  }

  const showTabs = () => {
    const tabs = [];

    if (component.type === "html") {
      tabs.push(
        <button
          key="html"
          onClick={() => setActiveTab("html")}
          className={`px-4 py-2 cursor-pointer rounded-lg ${
            activeTab === "html"
              ? "bg-gray-900 text-white"
              : "bg-gray-700 text-gray-200"
          }`}>
          HTML
        </button>
      );

      // Only show CSS tab if not using Tailwind
      if (!component.metadata?.useTailwind) {
        tabs.push(
          <button
            key="css"
            onClick={() => setActiveTab("css")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              activeTab === "css"
                ? "bg-gray-900 text-white"
                : "bg-gray-700 text-gray-200"
            }`}>
            CSS
          </button>
        );
      }

      if (component.code.js) {
        tabs.push(
          <button
            key="js"
            onClick={() =>
              setActiveTab(
                (component.metadata?.language || "js") as "js" | "ts"
              )
            }
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              activeTab === (component.metadata?.language || "js")
                ? "bg-gray-900 text-white"
                : "bg-gray-700 text-gray-200"
            }`}>
            {component.metadata?.language === "ts"
              ? "TypeScript"
              : "JavaScript"}
          </button>
        );
      }
    } else {
      // For React components
      if (component.metadata?.language === "ts") {
        tabs.push(
          <button
            key="tsx"
            onClick={() => setActiveTab("tsx")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              activeTab === "tsx"
                ? "bg-gray-900 text-white"
                : "bg-gray-700 text-gray-200"
            }`}>
            TSX
          </button>
        );
      } else {
        tabs.push(
          <button
            key="jsx"
            onClick={() => setActiveTab("jsx")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              activeTab === "jsx"
                ? "bg-gray-900 text-white"
                : "bg-gray-700 text-gray-200"
            }`}>
            JSX
          </button>
        );
      }
      // Always show CSS tab if code.css exists
      if (component.code.css) {
        tabs.push(
          <button
            key="css"
            onClick={() => setActiveTab("css")}
            className={`px-4 py-2 rounded-lg cursor-pointer ${
              activeTab === "css"
                ? "bg-gray-900 text-white"
                : "bg-gray-700 text-gray-200"
            }`}>
            CSS
          </button>
        );
      }
    }

    return tabs;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <button
        onClick={handleBack}
        className="text-white cursor-pointer link-underline flex items-center gap-1 px-1">
        <IoArrowBackSharp className="h-4 w-4 mt-1" />
        <span className="capitalize">back</span>
      </button>
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden text-white">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{component.name}</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <Link
                  href={`/elements/user-profile/${component.username}`}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  {component.userImage ? (
                    <Image
                      src={component.userImage}
                      alt={component.username}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <FaUser className="w-4 h-4" />
                  )}
                  <span>{component.username}</span>
                </Link>
                <div className="flex items-center gap-2">
                  <FaCalendar className="w-4 h-4" />
                  <span>
                    Created:{" "}
                    {new Date(component.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {component.updatedAt && (
                  <div className="flex items-center gap-2">
                    <FaCalendar className="w-4 h-4" />
                    <span>
                      Updated:{" "}
                      {new Date(component.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              title="Copy Code"
              onClick={handleCopyActiveTabCode}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 cursor-pointer hover:bg-gray-700 rounded-lg transition-colors">
              <BiCopy className="w-5 h-5" />
              {copyStatus && (
                <span className="text-sm text-green-400 font-semibold">
                  {copyStatus}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
              {component.type}
            </span>
            {component.metadata?.language && (
              <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
                {component.metadata.language}
              </span>
            )}
            {component.metadata?.useTailwind && (
              <span className="text-sm bg-blue-900 text-blue-200 px-3 py-1 rounded-full">
                Tailwind
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">{showTabs()}</div>
            </div>

            {showCode && (
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>
                    {component.type === "html"
                      ? activeTab === "html"
                        ? component.code.html
                        : activeTab === "css"
                        ? component.code.css
                        : component.code.js
                      : activeTab === "css"
                      ? component.code.css
                      : activeTab === "tsx"
                      ? component.code.tsx
                      : component.code.jsx}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentDetails;
