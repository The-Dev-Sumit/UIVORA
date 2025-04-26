import React from "react";

interface ElementSidebarButtonProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const ElementSidebarButton: React.FC<ElementSidebarButtonProps> = ({
  label,
  icon,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-[.6rem] md:text-[.9rem] lg:text-[1rem] text-left px-2 py-2 cursor-pointer rounded-lg tracking-wider flex items-center gap-2 transition-all duration-200 ${
        isActive
          ? "bg-black/70 w-full text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}>
      {icon && <span className="text-xl">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default ElementSidebarButton;
