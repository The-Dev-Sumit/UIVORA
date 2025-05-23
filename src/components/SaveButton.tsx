import React, { useState, useRef, useEffect } from "react";
import "@/styles/SaveButton.css";
import { gsap } from "gsap";

interface SaveButtonProps {
  handleSave: () => void;
  cancelEditing: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  handleSave,
  cancelEditing,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const pathRef = useRef<SVGPathElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isActive) return;

    setIsActive(true);
    try {
      await handleSave();

      setTimeout(() => {
        cancelEditing();
      }, 2000);

      const tl = gsap.timeline({
        onComplete: () => setIsActive(false),
      });

      if (pathRef.current) {
        tl.to(pathRef.current, {
          scaleX: 0.95,
          scaleY: 0.9,
          duration: 0.3,
          delay: 0.3,
        }).to(pathRef.current, {
          scaleX: 1,
          scaleY: 1,
          duration: 1.7,
          ease: "elastic.out(1, 0.15)",
        });
      }
    } catch (error) {
      setIsActive(false);
      console.error("Save failed:", error);
    }
  };

  useEffect(() => {
    // Initialize GSAP animation without MorphSVGPlugin
    gsap.to(buttonRef.current, {
      scale: isActive ? 0.95 : 1,
      duration: 0.2,
    });
  }, [isActive]);

  return (
    <>
      <button
        className={`flex items-center justify-center relative px-2 py-2 bg-transparent text-[#C3C8DE]  cursor-pointer outline-none border-none ${
          isActive ? "active" : ""
        }`}
        onClick={handleClick}
        ref={buttonRef}>
        <svg className="btn-layer absolute top-[-26px] rounded-lg w-full py-1 h-[4.5rem] z-[2] pointer-events-none fill-[#0E1822]">
          <path
            ref={pathRef}
            d="M133,77.5H7c-3.9,0-7-3.1-7-7v-41c0-3.9,3.1-7,7-7h126c3.9,0,7,3.1,7,7v41C140,74.4,136.9,77.5,133,77.5z"
          />
        </svg>
        <svg className="plane absolute left-[14px] w-[20px] h-[20px] z-[3] fill-[#3D90D7]">
          <use xlinkHref="#plane" />
        </svg>
        <ul className="list-none p-0  relative overflow-hidden m-0">
          <li className="inline-block relative z-[2] px-2 pl-8 font-['Varela_Round'] font-normal text-[16px] transition-[transform,opacity] duration-300 ease-in-out opacity-100">
            Save
          </li>
        </ul>
      </button>
      {/* SVG Symbols */}
      <svg xmlns="http://www.w3.org/2000/svg" className="hidden-svg">
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 140 100"
          id="btn-layer"
          preserveAspectRatio="none">
          <path d="M133,77.5H7c-3.9,0-7-3.1-7-7v-41c0-3.9,3.1-7,7-7h126c3.9,0,7,3.1,7,7v41C140,74.4,136.9,77.5,133,77.5z" />
        </symbol>
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 28 26"
          id="plane"
          preserveAspectRatio="none">
          <path d="M5.25,15.24,18.42,3.88,7.82,17l0,4.28a.77.77,0,0,0,1.36.49l3-3.68,5.65,2.25a.76.76,0,0,0,1-.58L22,.89A.77.77,0,0,0,20.85.1L.38,11.88a.76.76,0,0,0,.09,1.36Z" />
        </symbol>
      </svg>
    </>
  );
};

export default SaveButton;
