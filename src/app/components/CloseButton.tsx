"use client";
import React from "react";

interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  return (
    <button
      className="text-white capitalize bg-red-600 px-3 py-1 rounded-full -mt-[25px] -mr-1.5 cursor-pointer"
      onClick={onClose}
    >
      X
    </button>
  );
};

export default CloseButton;
