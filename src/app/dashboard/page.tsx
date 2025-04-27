"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MainContent } from "@/components/layout/MainContent";
import { useState, useEffect } from "react";
import HTMLPlayground from "@/components/dashboard/HTMLPlayground";
import ReactPlayground from "@/components/dashboard/ReactPlayground";
import ProfileDropdown from "@/components/profile/ProfileDropdown";
import { useRouter } from "next/navigation";
import axios from "axios";
import { TiHtml5 } from "react-icons/ti";
import { FaReact } from "react-icons/fa";
import { TbBrandJavascript } from "react-icons/tb";
import { TbBrandTypescript } from "react-icons/tb";
import { FaCss3 } from "react-icons/fa6";
import { SiTailwindcss } from "react-icons/si";
import { TbBrandReact } from "react-icons/tb";
import { useSession } from "next-auth/react";
import ProfilePage from "@/components/profile/ProfilePage";
import GetHelp from "@/components/help/GetHelp";
import MyComponents from "@/components/my-components/MyComponents";
import Loader from "@/components/loader/Loader";
import { SiElement } from "react-icons/si";
import Image from "next/image";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [myName, setMyName] = useState(session?.user?.name || "loading...");
  const [activeTab, setActiveTab] = useState("html");
  const [htmlSubTab, setHtmlSubTab] = useState<"js" | "ts">("js");
  const [reactSubTab, setReactSubTab] = useState("jsx");
  const [htmlUseTailwind, setHtmlUseTailwind] = useState(false);
  const [reactUseTailwind, setReactUseTailwind] = useState(false);
  const [activePage, setActivePage] = useState("playground");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user");

        if (response.status === 200) {
          setUserData(response.data);
          setMyName(response.data.username);
        } else {
          setError(response.data.error || "Failed to load user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, router]);

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = () => {
    setActivePage("profile");
  };

  const handleHelpClick = () => {
    setActivePage("help");
  };

  // Loading ya authentication nahi hai to loading state dikhao
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar minWidth={200} maxWidth={270}>
        <button
          title="Elements Page"
          onClick={() => router.push("/elements")}
          className="flex items-start justify-start cursor-pointer w-full">
          <SiElement className="text-xl text-white" />
        </button>
        <div className="py-4">
          <Image
            src="/UIVORA.png"
            alt="UIVORA icon"
            width={150}
            height={50}
            className="mb-10"
            priority
          />
          <div className="space-y-2">
            <button
              onClick={() => setActivePage("playground")}
              className={`w-full text-left px-4 py-2 cursor-pointer rounded-lg tracking-wider ${
                activePage === "playground"
                  ? "bg-black/70 w-full text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}>
              Playground
            </button>
            <button
              onClick={() => setActivePage("my-components")}
              className={`w-full text-left px-4 py-2 cursor-pointer rounded-lg tracking-wider ${
                activePage === "my-components"
                  ? "bg-black/70 w-full text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}>
              My Components
            </button>
          </div>
        </div>
      </Sidebar>

      <MainContent>
        <div className="w-full min-h-screen main-content">
          {activePage === "playground" ? (
            <>
              {/* Taskbar ka section */}
              <div className="w-full py-1 px-10 flex flex-row gap-16">
                {/* HTML wala section */}
                <div className="flex flex-col justify-center items-center ml-44">
                  <button
                    className={`capitalize w-fit flex items-center gap-1 cursor-pointer px-3 py-1 link-underline ${
                      activeTab === "html"
                        ? "font-semibold border-1 border-amber-400 text-amber-100 px-5 py-1 rounded-4xl"
                        : "font-semibold text-white/85"
                    }`}
                    onClick={() => {
                      setActiveTab("html");
                    }}>
                    <TiHtml5 className="w-5 h-5 text-red-500" />
                    <span>html</span>
                  </button>
                  <div className="flex flex-row items-center gap-5 mt-4">
                    <button
                      className={`capitalize px-3 py-1 w-fit link-underline cursor-pointer flex items-center gap-1 ${
                        activeTab === "html" && htmlSubTab === "js"
                          ? "font-semibold border-1 border-amber-400 text-amber-100 px-5 py-1 rounded-4xl"
                          : "font-semibold text-white/85"
                      }`}
                      onClick={() =>
                        activeTab === "html" && setHtmlSubTab("js")
                      }
                      disabled={activeTab !== "html"}>
                      <TbBrandJavascript className="w-5 h-5 text-yellow-500" />
                      <span>js</span>
                    </button>
                    <button
                      className={`capitalize px-3 py-1 w-fit link-underline cursor-pointer flex items-center gap-1 ${
                        activeTab === "html" && htmlSubTab === "ts"
                          ? "font-semibold border-1 border-amber-400 text-amber-100 px-5 py-1 rounded-4xl"
                          : "font-semibold text-white/85"
                      }`}
                      onClick={() =>
                        activeTab === "html" && setHtmlSubTab("ts")
                      }
                      disabled={activeTab !== "html"}>
                      <TbBrandTypescript className="w-5 h-5" />
                      <span>ts</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        className={`capitalize px-3 py-1 w-fit link-underline cursor-pointer flex items-center gap-1 relative group ${
                          !htmlUseTailwind
                            ? "font-semibold border-1 border-amber-400 text-amber-100 px-5 py-1 rounded-4xl"
                            : "text-white/85 font-semibold"
                        }
                          ${
                            htmlUseTailwind
                              ? "font-semibold border-1 border-amber-400 text-amber-100 px-5 py-1 rounded-4xl"
                              : "text-white/85 font-semibold"
                          }
                        `}
                        onClick={() =>
                          activeTab === "html" &&
                          setHtmlUseTailwind(!htmlUseTailwind)
                        }
                        disabled={activeTab !== "html"}>
                        {!htmlUseTailwind ? (
                          <>
                            <FaCss3 className="w-4 h-4" />
                            <span>css</span>
                            <span className="absolute w-28 -top-7 left-20 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              Click for Tailwind
                            </span>
                          </>
                        ) : (
                          <>
                            <SiTailwindcss className="w-5 h-5 text-blue-400" />
                            <span>tailwind css</span>
                            <span className="absolute left-20 transform -translate-x-1/2 w-20 -top-7 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              Click for CSS
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* React wala section */}
                <div className="flex flex-col justify-center items-center">
                  <button
                    className={`capitalize w-fit flex items-center gap-1 cursor-pointer px-3 py-1 link-underline ${
                      activeTab === "react"
                        ? "font-semibold border-1 border-amber-400 text-amber-100 px-5 py-1 rounded-4xl"
                        : "font-semibold text-white/85"
                    }`}
                    onClick={() => {
                      setActiveTab("react");
                    }}>
                    <FaReact className="w-5 h-5 text-blue-400" />
                    <span>react</span>
                  </button>
                  <div className="flex flex-row items-center gap-4 mt-4">
                    <button
                      className={`capitalize w-fit link-underline cursor-pointer px-3 py-1 flex items-center gap-1 ${
                        activeTab === "react" && reactSubTab === "jsx"
                          ? "font-semibold border-1 border-amber-400 text-amber-100 px-5 py-1 rounded-4xl"
                          : "font-semibold text-white/85"
                      }`}
                      onClick={() =>
                        activeTab === "react" && setReactSubTab("jsx")
                      }
                      disabled={activeTab !== "react"}>
                      <FaReact className="w-5 h-5 text-blue-400" />
                      <span>jsx</span>
                    </button>
                    <button
                      className={`capitalize w-fit link-underline cursor-pointer px-3 py-1 flex items-center gap-1 ${
                        activeTab === "react" && reactSubTab === "tsx"
                          ? "font-semibold border-1 border-amber-400 text-amber-100 px-5 py-1 rounded-4xl"
                          : "font-semibold text-white/85"
                      }`}
                      onClick={() =>
                        activeTab === "react" && setReactSubTab("tsx")
                      }
                      disabled={activeTab !== "react"}>
                      <TbBrandReact className="w-5 h-5 text-blue-400" />
                      <span>tsx</span>
                    </button>
                    <button
                      className={`capitalize w-fit link-underline cursor-pointer px-3 py-1 flex items-center gap-1 relative group ${
                        !reactUseTailwind
                          ? "font-semibold border-1 border-amber-400 text-amber-100 px-5 py-1 rounded-4xl"
                          : "text-white/85 font-semibold"
                      }
                        ${
                          reactUseTailwind
                            ? "font-semibold border-1 border-amber-400 text-amber-100 px-5 py-1 rounded-4xl"
                            : "text-white/85 font-semibold"
                        }
                      `}
                      onClick={() =>
                        activeTab === "react" &&
                        setReactUseTailwind(!reactUseTailwind)
                      }
                      disabled={activeTab !== "react"}>
                      {!reactUseTailwind ? (
                        <>
                          <FaCss3 className="w-4 h-4" />
                          <span>css</span>
                          <span className="absolute w-28 -top-9 left-20 transform -translate-x-1/2 text-xs text-gray-400 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                            Click for Tailwind Css
                          </span>
                        </>
                      ) : (
                        <>
                          <SiTailwindcss className="w-5 h-5 text-blue-400" />
                          <span>tailwind css</span>
                          <span className="absolute w-28 -top-7 left-20 transform tracking-wide -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click for CSS
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-5 ml-[6vw]">
                  <ProfileDropdown
                    username={myName}
                    onLogout={handleLogout}
                    onProfileClick={handleProfileClick}
                    onHelpClick={handleHelpClick}
                  />
                </div>
              </div>

              <div className="mt-5 w-full">
                {activeTab === "html" && (
                  <HTMLPlayground
                    useTailwind={htmlUseTailwind}
                    language={htmlSubTab}
                  />
                )}
                {activeTab === "react" && (
                  <ReactPlayground
                    isTypeScript={reactSubTab === "tsx"}
                    useTailwind={reactUseTailwind}
                  />
                )}
              </div>
            </>
          ) : activePage === "profile" ? (
            <ProfilePage />
          ) : activePage === "my-components" ? (
            <MyComponents />
          ) : (
            <GetHelp />
          )}
        </div>
      </MainContent>
    </div>
  );
};

export default DashboardPage;
