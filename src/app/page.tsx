import ElementComponent from "@/components/ElementComponent";
import { Poppins } from "next/font/google";
import { Karla } from "next/font/google";
import Link from "next/link";

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
      <div className=" flex gap-2 flex-col items-center justify-center w-full  md:mt-10 lg:mt-20">
        <h1 className={`flex  text-white select-none uppercase  ${poppins.className}`}>
          <span className="text-4xl md:text-5xl fancy lg:text-[6rem]">
            Uivora
          </span>
          <img src="tgs.gif" alt="tgs" className="h-6 w-7" />
        </h1>
        <p
          className={`w-[80%] mt-5 text-white px-5 md:px-7 lg:px-10 md:text-xl ${karla.className} text-center text-wrap`}>
          Welcome to Uivora, were you can get amazing UI elements that you can
          use in your projects also
        </p>
      </div>
      <div className="mt-3">
        <ElementComponent />
      </div>
      <div>
        <Link href="/elements">
          <button className="capitalize italic flex items-center gap-2 font-semibold border-1 tracking-wide active:scale-95 border-amber-200 hover:border-indigo-400 cursor-pointer px-2 py-1 rounded-md">
            <span className="text-[1.3rem] text-white">elements</span>
            <img
              src="rocket2.gif"
              alt="animated icon"
              className="w-5 h-5 mt-1 invert sepia hue-rotate-180"
            />
          </button>
        </Link>
      </div>
    </div>
  );
}
