"use client";

import React, {
  useEffect,
  useState,
  lazy,
  Suspense,
  ComponentType,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "@/components/loader/Loader";
import { Sidebar } from "@/components/layout/Sidebar";
import { MainContent } from "@/components/layout/MainContent";
import ElementSidebarButton from "@/components/elements/ElementSidebarButton";
import { FaLayerGroup, FaSquare } from "react-icons/fa";
import { IoText } from "react-icons/io5";
import { BsCardText } from "react-icons/bs";
import { MdWallpaper } from "react-icons/md";
import { COMPONENT_TAGS, ComponentTag } from "@/components/TagSelectionModal";
import { FaCode } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import styled from "styled-components";

interface Component {
  _id: string;
  name: string;
  type: "html" | "react";
  code: {
    html?: string;
    css?: string;
    js?: string;
    jsx?: string;
  };
  createdAt: string;
  userId: string;
  metadata?: {
    language?: string;
    useTailwind?: boolean;
    tag?: ComponentTag;
  };
  tag?: ComponentTag;
}

type ComponentSection = "all" | "buttons" | "texts" | "cards" | "backgrounds";

interface LiveComponentsType {
  LiveProvider: ComponentType<any>;
  LivePreview: ComponentType<any>;
  LiveError: ComponentType<{ className?: string }>;
}

// Dynamic imports with proper error handling
const LiveComponents = lazy(() =>
  import("react-live").then((mod) => ({
    default: ({
      children,
    }: {
      children: (components: LiveComponentsType) => React.ReactNode;
    }) => {
      return children({
        LiveProvider: mod.LiveProvider,
        LivePreview: mod.LivePreview,
        LiveError: mod.LiveError,
      });
    },
  }))
);

const ElementsPage = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ComponentTag>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 15;

  // Calculate component counts for each tag
  const getComponentCounts = () => {
    const counts: Record<ComponentTag, number> = {
      all: components.length,
      buttons: components.filter(
        (c) => c.tag === "buttons" || c.metadata?.tag === "buttons"
      ).length,
      texts: components.filter(
        (c) => c.tag === "texts" || c.metadata?.tag === "texts"
      ).length,
      cards: components.filter(
        (c) => c.tag === "cards" || c.metadata?.tag === "cards"
      ).length,
      backgrounds: components.filter(
        (c) => c.tag === "backgrounds" || c.metadata?.tag === "backgrounds"
      ).length,
    };
    return counts;
  };

  const componentCounts = getComponentCounts();

  const fetchComponents = async (pageNum: number) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `/api/components/public?page=${pageNum}&limit=${ITEMS_PER_PAGE}`
      );
      const data = response.data;

      if (Array.isArray(data)) {
        const componentsWithTags = data.map((component) => ({
          ...component,
          tag: component.tag || component.metadata?.tag || "all",
        }));

        if (pageNum === 1) {
          setComponents(componentsWithTags);
        } else {
          setComponents((prev) => [...prev, ...componentsWithTags]);
        }

        // If we got less than ITEMS_PER_PAGE items, we've reached the end
        setHasMore(data.length === ITEMS_PER_PAGE);
      } else {
        console.error("Expected array response but got:", data);
        setComponents([]);
      }
    } catch (error) {
      console.error("Error fetching components:", error);
      setError("Failed to load components. Please try again.");
      setComponents([]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = document.documentElement.clientHeight;

    // Load more when user is near the bottom
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fetch components when page changes
  useEffect(() => {
    fetchComponents(page);
  }, [page]);

  const handleComponentClick = (componentId: string) => {
    router.push(`/elements/${componentId}`);
  };

  const scope = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
    motion,
    gsap,
  };

  const filteredComponents = components.filter((component) => {
    if (activeSection === "all") {
      return true;
    }
    return (
      component.tag === activeSection ||
      component.metadata?.tag === activeSection
    );
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => fetchComponents(1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar minWidth={190} maxWidth={280}>
        <button
          title="Home"
          onClick={() => router.push("/")}
          className="flex items-start justify-start cursor-pointer w-full">
          <AiFillHome className="text-xl text-white" />
        </button>
        <div className="py-3">
          <Image
            src="/UIVORA.png"
            alt="UIVORA icon"
            width={150}
            height={50}
            className="mb-10"
            priority
          />
          <div className="space-y-2">
            {COMPONENT_TAGS.map((section) => (
              <ElementSidebarButton
                key={section.id}
                label={`${section.label} (${componentCounts[section.id]})`}
                icon={section.icon}
                isActive={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </div>
        </div>
      </Sidebar>

      <MainContent>
        <div className="w-full min-h-screen main-content p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component) => (
              <motion.div
                key={component._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-auto w-full max-w-sm mx-auto">
                <div className="p-2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{component.name}</h2>
                    <span className="text-sm text-gray-500">
                      {new Date(component.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="relative w-48 h-48 bg-gray-50 rounded-lg overflow-hidden">
                    {component.type === "html" ? (
                      <iframe
                        title={`${component.name} preview`}
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <style>
                                html, body {
                                  margin: 0;
                                  padding: 0;
                                  width: 100%;
                                  height: 100%;
                                  box-sizing: border-box;
                                }
                                ${component.code.css || ""}
                              </style>
                              ${
                                component.code.css
                                  ? ""
                                  : '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>'
                              }
                            </head>
                            <body>
                                ${component.code.html}
                              ${
                                component.code.js
                                  ? `<script>${component.code.js}</script>`
                                  : ""
                              }
                            </body>
                          </html>
                        `}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts"
                      />
                    ) : (
                      <Suspense
                        fallback={
                          <div className="w-full h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                          </div>
                        }>
                        <LiveComponents>
                          {({
                            LiveProvider,
                            LivePreview,
                            LiveError,
                          }: LiveComponentsType) => (
                            <LiveProvider
                              key={component._id}
                              code={`
                                ${
                                  component.code.css
                                    ? `const style = document.createElement('style');
                                      style.textContent = \`${component.code.css}\`;
                                      document.head.appendChild(style);`
                                    : ""
                                }
                                ${
                                  component.metadata?.useTailwind
                                    ? `const tailwindScript = document.createElement('script');
                                      tailwindScript.src = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';
                                      document.head.appendChild(tailwindScript);`
                                    : ""
                                }
                                
                                function ReadyComponent() {
                                  ${component.code.jsx || ""}
                                }
                                render(<ReadyComponent />);
                              `}
                              scope={{
                                ...scope,
                                React,
                                useState: React.useState,
                                useEffect: React.useEffect,
                                styled,
                              }}
                              noInline={true}>
                              <div className="w-full h-full flex items-center justify-center p-4">
                                <LivePreview />
                              </div>
                              <LiveError className="text-red-500 text-sm absolute bottom-0 left-0 right-0 bg-red-50 p-2" />
                            </LiveProvider>
                          )}
                        </LiveComponents>
                      </Suspense>
                    )}
                  </div>
                  <button
                    onClick={() => handleComponentClick(component._id)}
                    title="Codes"
                    className="flex items-end justify-end cursor-pointer w-full">
                    <FaCode className="text-2xl" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center my-4">
              <Loader />
            </div>
          )}
        </div>
      </MainContent>
    </div>
  );
};

export default ElementsPage;
