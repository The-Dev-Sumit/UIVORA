"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { CircleFadingPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

const NavWrapper = () => {
  const pathname = usePathname();
  const hideNavRoutes = ["/dashboard", "/elements"];
  const [showModal, setShowModal] = useState(false);

  const shouldHideNav = hideNavRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const handleGoogleLogin = () => {
    const callbackUrl = process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
      : "/dashboard";

    signIn("google", {
      callbackUrl,
      redirect: true,
    });
  };

  const handleGitHubLogin = () => {
    const callbackUrl = process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
      : "/dashboard";

    signIn("github", {
      callbackUrl,
      redirect: true,
    });
  };

  if (shouldHideNav) return null;

  return (
    <>
      <nav className="flex w-full justify-between items-center p-4 z-30 fixed">
        <div className="py-2 text-[.7rem] font-semibold md:text-[.9rem] lg:px-3  lg:ml-16 ">
          <Image
            src="/UIVORA.png"
            alt="UIVORA icon"
            width={224}
            height={36}
            className="lg:w-[14rem] md:w-[14rem] w-[9rem] h-8 md:h-9"
            priority
          />
        </div>
        <div className="lg:mr-16 mr-2">
          <button
            onClick={() => setShowModal(true)}
            className="py-2 px-3 cursor-pointer flex items-center gap-2 border-1 border-white hover:border-indigo-400 text-white rounded-md text-[.8rem] md:text-[.9rem] lg:text-[1rem]">
            <span className="font-semibold"> Create </span>
            <CircleFadingPlus className="w-4 h-4 mt-1" />
          </button>
        </div>
      </nav>

      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-20 rounded-lg shadow-xl">
            <div className="flex text-white flex-col items-center gap-4">
              <h2 className="text-2xl font-bold mb-4">Continue with</h2>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center gap-2 py-2 px-4 cursor-pointer border-1 border-gray-200 hover:border-indigo-400 text-white rounded-md">
                <FcGoogle className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
              <button
                onClick={handleGitHubLogin}
                className="w-full flex items-center gap-2 py-2 px-4 cursor-pointer border-1 border-white hover:border-indigo-400 text-white rounded-md hover:bg-slate-800">
                <SiGithub className="h-4 w-4" />
                <span>Continue with GitHub</span>
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 text-sm cursor-pointer flex items-center gap-1 text-gray-400 font-semibold hover:text-red-800">
                <AiOutlineClose className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavWrapper;
