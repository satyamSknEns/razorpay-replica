"use client";
import React from "react";

interface CustomButtonProps {
  text: string;
  onClick: () => void;
  color?: string;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  color = "bg-blue-600",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded capitalize text-white font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 ${color} ${className}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
