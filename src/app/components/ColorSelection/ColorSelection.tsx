import React from "react";

interface ColorPickerProps {
  colors: string[];
  onColorSelect: (color: string) => void;
}

export default function ColorPicker({
  colors,
  onColorSelect,
}: ColorPickerProps) {
  return (
    <div className="flex gap-4 ml-4">
      {colors.map((color) => {
        return (
          <div
            key={color}
            style={{ backgroundColor: color }}
            className="w-7 h-7 rounded-full cursor-pointer"
            onClick={() => onColorSelect(color)}
          />
        );
      })}
    </div>
  );
}
