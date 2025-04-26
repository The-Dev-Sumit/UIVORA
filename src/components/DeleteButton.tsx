import React from "react";

// Prop types for type checking
interface DeleteButtonProps {
  onClick: () => void; 
  onAnimationEnd?: (isAnimating: boolean) => void; 
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  onAnimationEnd,
}) => {
  const handleClick = () => {
    if (onAnimationEnd) onAnimationEnd(true);
    setTimeout(() => {
      if (onAnimationEnd) onAnimationEnd(false);
      onClick();
    }, 2000);
  };


  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" className="hidden">
        <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="top">
          <path d="M15,3.75 C15.5522847,3.75 16,4.19771525 16,4.75 L16,5.75 L18.25,5.75 C18.6642136,5.75 19,6.08578644 19,6.5 C19,6.91421356 18.6642136,7.25 18.25,7.25 L5.75,7.25 C5.33578644,7.25 5,6.91421356 5,6.5 C5,6.08578644 5.33578644,5.75 5.75,5.75 L8,5.75 L8,4.75 C8,4.19771525 8.44771525,3.75 9,3.75 L15,3.75 Z" />
        </symbol>
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          id="bottom">
          <path d="M7.02498527,8.25 L16.9751371,8.25 C17.5411532,8.25 18,8.69771525 18,9.25 C18,9.2951932 17.9968602,9.34033442 17.9906022,9.3851132 L16.6878729,18.7066989 C16.6389095,19.0569074 16.4041276,19.3558931 16.0703039,19.4931212 C14.8428392,19.9977071 13.4860916,20.25 12.0000612,20.25 C10.5140229,20.25 9.1572688,19.9977044 7.92979891,19.4931132 C7.59597391,19.3558774 7.36118974,19.0568881 7.31224574,18.7066728 L6.00952014,9.3851132 C5.93304388,8.83789281 6.32568685,8.33379079 6.88651275,8.25916983 C6.93240487,8.25306363 6.97866843,8.25 7.02498527,8.25 Z" />
        </symbol>
      </svg>
      {/* Button element with Tailwind classes */}
      <button
        onClick={handleClick}
        className={`flex items-center justify-center px-3 py-2 rounded-[13px] font-semibold text-[12px] text-white bg-[#33394b] hover:bg-[#0e1016] transition-all duration-300 transform scale-100 active:scale-95 outline-none border-none cursor-pointer overflow-hidden font-inter delete group`}>
        <div className="icon w-6 h-6 mr-2 relative z-10 text-white">
          <svg className="top absolute w-24 h-24 -left-9 -top-9 will-change-transform fill-white scale-[0.25] group-[.delete]:animate-trash-top">
            <use xlinkHref="#top" />
          </svg>
          <svg className="bottom absolute w-24 h-24 -left-9 -top-9 will-change-transform fill-white scale-[0.25] group-[.delete]:animate-trash-bottom">
            <use xlinkHref="#bottom" />
          </svg>
        </div>
        <span className="text inline-block align-top group-[.delete]:animate-text">
          Delete
        </span>
      </button>
    </>
  );
};

export default DeleteButton;
