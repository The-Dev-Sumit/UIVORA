"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaCode, FaCopy } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Editor from "@monaco-editor/react";
import { LiveProvider, LiveError, LivePreview } from "react-live";
import { motion } from "framer-motion";
import gsap from "gsap";
import Loader from "@/components/loader/Loader";
import Modal from "react-modal";
import { IoWarning } from "react-icons/io5";
import CancelButton from "@/components/CancelButton";
import DeleteButton from "../DeleteButton";
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
    language?: "js" | "ts";
    useTailwind?: boolean;
  };
}

const MyComponents = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingComponent, setEditingComponent] = useState<Component | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState<string | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState<string>("html");

  const handleAnimationEnd = (isAnimating: boolean) => {
    setIsAnimating(isAnimating);
    console.log(`Animation ${isAnimating ? "started" : "ended"}`);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchComponents();
    }
  }, [status, router]);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated
      if (!session?.user?.email) {
        setError("Please login to view your components");
        setComponents([]);
        return;
      }

      const response = await axios.get("/api/user/components", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data); // Debug log

      if (Array.isArray(response.data)) {
        // Filter components to only show those belonging to the current user
        const userComponents = response.data.filter(
          (component) => component.userId === session.user.email
        );
        setComponents(userComponents);
      } else {
        console.error("Invalid response format:", response.data);
        setComponents([]);
        toast.error("Invalid response format from server");
      }
    } catch (error: any) {
      console.error("Error fetching components:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to load components";
      setError(errorMessage);
      toast.error(errorMessage);
      setComponents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (component: Component) => {
    setEditingComponent(component);
  };

  const handleDelete = async (componentId: string) => {
    setComponentToDelete(componentId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!componentToDelete) return;

    try {
      await axios.delete(`/api/user/components?id=${componentToDelete}`);
      toast.success("Component deleted successfully");
      fetchComponents(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting component:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to delete component";
      toast.error(errorMessage);
    } finally {
      setDeleteModalOpen(false);
      setComponentToDelete(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingComponent) return;

    try {
      const response = await axios.put(
        `/api/user/components?id=${editingComponent._id}`,
        {
          code: editingComponent.code,
        }
      );

      if (response.data.success) {
        toast.success("Component updated successfully");
        setEditingComponent(null);
        fetchComponents(); // Refresh the list
      } else {
        toast.error("Failed to update component");
      }
    } catch (error) {
      console.error("Error updating component:", error);
      toast.error("Failed to update component");
    }
  };

  const handleCodeChange = (value: string | undefined, type: string) => {
    if (!editingComponent || !value) return;

    setEditingComponent({
      ...editingComponent,
      code: {
        ...editingComponent.code,
        [type]: value,
      },
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen p-4">
        <div className="max-w-6xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg p-6">
          <div className="text-center py-12">
            <FaCode className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-lg font-medium text-red-300">
              Error Loading Components
            </h3>
            <p className="mt-1 text-sm text-gray-400">{error}</p>
            <button
              onClick={fetchComponents}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scope = {
    motion,
    gsap,
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
    styled,
  };

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1F2937",
      border: "none",
      borderRadius: "0.5rem",
      padding: "2rem",
      maxWidth: "400px",
      width: "90%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000,
    },
  };

  return (
    <div className="w-full min-h-screen py-2">
      <div className="max-w-6xl mx-auto bg-transparent text-white rounded-lg shadow-lg p-4">
        {editingComponent ? (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-white">
                Editing: {editingComponent.name}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveEdit();
                  }}
                  className="px-4 py-2 cursor-pointer z-30 text-white rounded-lg hover:bg-green-600">
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingComponent(null);
                    toast.success("Edit cancelled");
                  }}
                  className="px-4 py-2 text-white z-30 rounded-lg cursor-pointer hover:bg-red-800">
                  Cancel
                </button>
              </div>
            </div>
            <div className="flex gap-8 mt-4">
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  {editingComponent.type === "html" ? (
                    <>
                      <button
                        className={`px-3 py-1 rounded-md ${
                          activeEditTab === "html"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-700 text-gray-200"
                        }`}
                        onClick={() => setActiveEditTab("html")}>
                        HTML
                      </button>
                      {!editingComponent.code.useTailwind && (
                        <button
                          className={`px-3 py-1 rounded-md ${
                            activeEditTab === "css"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-700 text-gray-200"
                          }`}
                          onClick={() => setActiveEditTab("css")}>
                          CSS
                        </button>
                      )}
                      <button
                        className={`px-3 py-1 rounded-md ${
                          activeEditTab === "js"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-700 text-gray-200"
                        }`}
                        onClick={() => setActiveEditTab("js")}>
                        {editingComponent.code.language === "ts"
                          ? "TypeScript"
                          : "JavaScript"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={`px-3 py-1 rounded-md ${
                          activeEditTab === "jsx"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-700 text-gray-200"
                        }`}
                        onClick={() => setActiveEditTab("jsx")}>
                        JSX
                      </button>
                      {!editingComponent.code.useTailwind && (
                        <button
                          className={`px-3 py-1 rounded-md ${
                            activeEditTab === "css"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-700 text-gray-200"
                          }`}
                          onClick={() => setActiveEditTab("css")}>
                          CSS
                        </button>
                      )}
                    </>
                  )}
                </div>
                {editingComponent.type === "html" ? (
                  <>
                    {activeEditTab === "html" && (
                      <Editor
                        height="200px"
                        defaultLanguage="html"
                        value={editingComponent.code.html}
                        onChange={(value) => handleCodeChange(value, "html")}
                        theme="vs-dark"
                      />
                    )}
                    {activeEditTab === "css" &&
                      !editingComponent.code.useTailwind && (
                        <Editor
                          height="200px"
                          defaultLanguage="css"
                          value={editingComponent.code.css}
                          onChange={(value) => handleCodeChange(value, "css")}
                          theme="vs-dark"
                        />
                      )}
                    {activeEditTab === "js" && (
                      <Editor
                        height="200px"
                        defaultLanguage={
                          editingComponent.code.language || "javascript"
                        }
                        value={editingComponent.code.js}
                        onChange={(value) => handleCodeChange(value, "js")}
                        theme="vs-dark"
                      />
                    )}
                  </>
                ) : (
                  <>
                    {activeEditTab === "jsx" && (
                      <Editor
                        height="400px"
                        defaultLanguage="javascript"
                        value={editingComponent.code.jsx}
                        onChange={(value) => handleCodeChange(value, "jsx")}
                        theme="vs-dark"
                      />
                    )}
                    {activeEditTab === "css" &&
                      !editingComponent.code.useTailwind && (
                        <Editor
                          height="400px"
                          defaultLanguage="css"
                          value={editingComponent.code.css}
                          onChange={(value) => handleCodeChange(value, "css")}
                          theme="vs-dark"
                        />
                      )}
                  </>
                )}
              </div>
              <div className="flex-1">
                {editingComponent.type === "html" ? (
                  <iframe
                    className="w-full h-screen"
                    title={`${editingComponent.name} preview`}
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
                            ${editingComponent.code.css || ""}
                          </style>
                          ${
                            editingComponent.code.useTailwind
                              ? '<script async src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>'
                              : ""
                          }
                        </head>
                        <body>
                            ${editingComponent.code.html || ""}
                          <script>${editingComponent.code.js || ""}</script>
                        </body>
                      </html>
                    `}
                    sandbox="allow-scripts"
                  />
                ) : (
                  <LiveProvider
                    code={`function EditComponent() {
                      ${editingComponent.code.jsx || ""}
                    }
                    render(<EditComponent />);
                    `}
                    scope={{
                      ...scope,
                      motion,
                      gsap,
                      React,
                      useState: React.useState,
                      useEffect: React.useEffect,
                      styled,
                    }}
                    noInline={true}>
                    <LiveError className="text-red-500 mb-4" />
                    <div className="h-[34rem] w-[34rem] bg-white overflow-auto">
                      <div className="w-full h-full">
                        {editingComponent.code.useTailwind && (
                          <script
                            async
                            src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                        )}
                        <style>{`html, body, #root { width: 100%; height: 100%; margin: 0; padding: 0; box-sizing: border-box; }`}</style>
                        {editingComponent.code.css && (
                          <style>{editingComponent.code.css}</style>
                        )}
                        <LivePreview />
                      </div>
                    </div>
                  </LiveProvider>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
            {components.map((component) => (
              <div
                key={component._id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <div className="p-2 border-b border-gray-900 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FaCode className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {component.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(component);
                      }}
                      className="p-2 cursor-pointer text-gray-400 hover:text-gray-600"
                      title="Edit">
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(component._id);
                      }}
                      className="p-2 cursor-pointer text-red-400 hover:text-red-700"
                      title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="h-[34rem] w-[34rem] bg-white overflow-auto">
                  {component.type === "html" ? (
                    <iframe
                      className="w-full h-full"
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
                    <LiveProvider
                      code={`
                        function ReadyComponent() {
                          ${component.code.jsx || ""}
                        }
                        render(<ReadyComponent />);
                      `}
                      scope={{
                        ...scope,
                        motion,
                        gsap,
                        React,
                        useState: React.useState,
                        useEffect: React.useEffect,
                        styled,
                      }}
                      noInline={true}>
                      <div className="h-[34rem] w-[34rem] bg-white overflow-auto">
                        {component.code.useTailwind && (
                          <script
                            async
                            src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                        )}
                        <style>{`html, body, #root { width: 100%; height: 100%; margin: 0; padding: 0; box-sizing: border-box; }`}</style>
                        {component.code.css && (
                          <style>{component.code.css}</style>
                        )}
                        <LivePreview />
                      </div>
                      <LiveError />
                    </LiveProvider>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal
        isOpen={deleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        style={customModalStyles}
        contentLabel="Delete Confirmation">
        <div className="text-white">
          <div className="flex items-center gap-3 mb-4">
            <IoWarning className="text-red-500 text-2xl" />
            <h2 className="text-xl font-semibold">Confirm Delete</h2>
          </div>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete this component? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <CancelButton onClick={() => setDeleteModalOpen(false)} />
            <DeleteButton
              onAnimationEnd={handleAnimationEnd}
              onClick={confirmDelete}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyComponents;
