import React from "react";
import Modal from "react-modal";
import { FaLayerGroup, FaSquare } from "react-icons/fa";
import { IoText } from "react-icons/io5";
import { BsCardText } from "react-icons/bs";
import { TbBackground } from "react-icons/tb";

export const COMPONENT_TAGS = [
  { id: "all", label: "All Components", icon: <FaLayerGroup /> },
  { id: "buttons", label: "Buttons", icon: <FaSquare /> },
  { id: "texts", label: "Texts", icon: <IoText /> },
  { id: "cards", label: "Cards", icon: <BsCardText /> },
  { id: "backgrounds", label: "Backgrounds", icon: <TbBackground /> },
] as const;

export type ComponentTag = (typeof COMPONENT_TAGS)[number]["id"];

interface TagSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTag: (tag: ComponentTag) => void;
}

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#1F2937",
    border: "none",
    borderRadius: "0.5rem",
    padding: "2rem",
    maxWidth: "400px",
    width: "90%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

const TagSelectionModal: React.FC<TagSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectTag,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel="Select Component Tag">
      <div className="text-white">
        <h2 className="text-xl font-semibold mb-4">Select Component Tag</h2>
        <div className="space-y-2">
          {COMPONENT_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => {
                onSelectTag(tag.id);
                onClose();
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <span className="text-xl">{tag.icon}</span>
              <span>{tag.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default TagSelectionModal;
