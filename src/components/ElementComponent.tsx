import React from 'react'
import { Lemon } from "next/font/google";

const lemon = Lemon({
  subsets: ["latin"],
  weight: "400",
});

const ElementComponent = () => {
  return (
    <div className="h-[23vh] select-none  md:h-[30vh] lg:h-[36vh] w-full p-2 flex flex-row justify-center items-center gap-2 md:gap-3 lg:gap-5 xl:gap-7">
      <div className="h-[80%] container hover:scale-105 transition-all duration-200 w-[20vw] drop-shadow-[0_0_1px_white] md:w-[18vw] lg:w-[17vw] xl:w-[15vw] rounded-lg flex justify-center items-center bg-amber-950">
        <h1
          className={`lg:text-7xl md:text-5xl drop-shadow-[0_0_1px_white] text-3xl ${lemon.className} text-center text-white`}>
          EL
        </h1>
      </div>
      <div className="h-[80%] hover:scale-105 transition-all duration-200 container drop-shadow-[0_0_1px_white] w-[20vw] md:w-[18vw] lg:w-[17vw] xl:w-[15vw] rounded-lg flex justify-center items-center bg-amber-950">
        <h1
          className={`lg:text-7xl drop-shadow-[0_0_1px_white] md:text-5xl text-3xl ${lemon.className} text-center text-white`}>
          EM
        </h1>
      </div>
      <div className="h-[80%] hover:scale-105 transition-all duration-200 container w-[20vw] drop-shadow-[0_0_1px_white] md:w-[18vw] lg:w-[17vw] xl:w-[15vw] rounded-lg flex justify-center items-center bg-amber-950">
        <h1
          className={`lg:text-7xl md:text-5xl drop-shadow-[0_0_1px_white] text-3xl ${lemon.className} text-center text-white`}>
          EN
        </h1>
      </div>
      <div className="h-[80%] hover:scale-105 transition-all duration-200 container drop-shadow-[0_0_1px_white] w-[20vw] md:w-[18vw] lg:w-[17vw] xl:w-[15vw] rounded-lg flex justify-center items-center bg-amber-950">
        <h1
          className={`lg:text-7xl md:text-5xl drop-shadow-[0_0_1px_white] text-3xl ${lemon.className} text-center text-white`}>
          TS
        </h1>
      </div>
    </div>
  );
}

export default ElementComponent