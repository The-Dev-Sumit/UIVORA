import React, { ReactNode } from "react";

interface AddRemoveButtonProps {
  onClick: () => void;
  className?: string;
    AddSvg?: ReactNode;
  text: string;
}

const AddRemoveButton: React.FC<AddRemoveButtonProps> = ({
  onClick,
  className = "",
  AddSvg,
  text,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center h-10 px-3 rounded-md w-[8rem] justify-center  cursor-pointer select-none transition-all duration-200 focus:outline-none group ${className}`}>
      <span className="font-bold transform  group-hover:text-transparent transition-all duration-200">
        {text}
      </span>
      <span
        className="absolute h-10 w-8 flex items-center justify-center
               transform translate-x-[90px] opacity-0 group-hover:opacity-100 
               group-hover:w-[30px] group-hover:border-l-0 group-hover:translate-x-0 
               transition-all duration-200">
        <span className="w-[30px] group-active:scale-[0.8] transition-transform duration-200">
          {AddSvg}
        </span>
      </span>
    </button>
  );
};

export default AddRemoveButton;
