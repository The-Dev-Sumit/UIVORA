import ElementComponent from "@/components/ElementComponent";
import { Poppins } from "next/font/google";
import { Karla } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { FiGithub } from "react-icons/fi";
import { RxDiscordLogo } from "react-icons/rx";

export const metadata: Metadata = {
  title: "Uivora",
  description: "The Ultimate UI Component Library.",
  keywords: [
    "Uivora",
    "UI Component Library",
    "React Components",
    "HTML Components",
    "Open Source",
    "Tailwind CSS",
    "Next.js project",
  ],
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
});

const karla = Karla({
  subsets: ["latin"],
  weight: "600",
});

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-800">
      <div className=" flex gap-2 flex-col items-center justify-center w-full md:mt-10 lg:mt-16">
        <h1
          className={`flex text-white select-none uppercase  ${poppins.className}`}>
          <span className="text-[2.8rem] md:text-[4.5rem] fancy lg:text-[5.8rem]">
            Uivora
          </span>
          <Image
            src="/tgs.gif"
            alt="tgs"
            width={28}
            height={24}
            className="h-6 w-7 mt-6"
          />
        </h1>
        <p
          className={`w-[80%] text-white px-5 md:px-7 lg:px-12 md:text-xl ${karla.className} text-center text-wrap`}>
          Welcome to Uivora an open source UI component library, where you can
          get amazing UI elements that you can use in your projects also you can
          contribute to the project.
        </p>
      </div>
      <div>
        <ElementComponent />
      </div>
      <div className="flex gap-4">
        <Link href="https://discord.gg/2Prgnwdh" target="_blank">
          <button
            title="Discord Server"
            className="text-white/50 text-2xl py-2 cursor-pointer">
            <RxDiscordLogo />
          </button>
        </Link>
        <Link href="/elements">
          <button className="capitalize italic flex items-center gap-2 font-semibold border-1 tracking-wide active:scale-95 border-amber-200 hover:border-indigo-400 cursor-pointer px-2 py-1 rounded-md">
            <span className="text-[1.3rem] text-white">elements</span>
            <Image
              src="/rocket2.gif"
              alt="animated icon"
              width={20}
              height={20}
              className="w-5 h-5 mt-1 invert sepia hue-rotate-180"
            />
          </button>
        </Link>
        <Link href="https://github.com/The-Dev-Sumit/UIVORA" target="_blank">
          <button
            title="Github Repository"
            className="text-white/50 text-2xl py-2 cursor-pointer">
            <FiGithub />
          </button>
        </Link>
      </div>
    </div>
  );
}
