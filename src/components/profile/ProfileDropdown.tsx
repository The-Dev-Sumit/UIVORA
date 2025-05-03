"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound } from "lucide-react";
import { Info } from "lucide-react";
import { LogOut } from "lucide-react";
import { SquareChevronDown } from "lucide-react";

interface ProfileDropdownProps {
  username: string;
  onLogout: () => void;
  onProfileClick: () => void;
  onHelpClick: () => void;
}

const ProfileDropdown = ({
  username,
  onLogout,
  onProfileClick,
  onHelpClick,
}: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-medium flex items-center gap-2 text-white border-2 border-amber-400 rounded-md hover:rounded-4xl transition-all duration-300 cursor-pointer focus:outline-none">
        <span>{username}</span>
        <SquareChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && username && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-40 bg-gray-800 rounded-md shadow-lg z-50">
            <button
              onClick={() => {
                onProfileClick();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-white cursor-pointer hover:bg-gray-700 rounded-t-md">
              <UserRound className="w-4 h-4" />
              <span> My Profile </span>
            </button>
            <button
              onClick={() => {
                onHelpClick();
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-center gap-3 py-2 text-sm text-white cursor-pointer hover:bg-gray-700">
              <Info className="w-4 h-4" />
              <span> Get Help </span>
            </button>
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-center gap-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-gray-700 rounded-b-md">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
