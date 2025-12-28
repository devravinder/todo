import { memo, type ChangeEvent } from "react";

type Color = {
  "text-color": string;
  "bg-color": string;
};
type ColorPickerProps = {
  label?: string
  color?: Color;
  onChange: (color: Color) => void;
};

const ColorPicker = ({
  color = { "text-color": "#ffffff", "bg-color": "#3b82f6" },
  label="Label",
  onChange,
}: ColorPickerProps) => {
  const handleColorInput = (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof Color
  ) => {
    onChange({ ...color, [key]: e.target.value });
  };
  const handleHexInput = (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof Color
  ) => {
    let value = e.target.value;
    if (!value.startsWith("#")) {
      value = "#" + value;
    }
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      onChange({ ...color, [key]: e.target.value });
    }
  };

  return (
    <div className="flex flex-row items-start gap-4">
      <div className="flex flex-col gap-2 items-center">
        <span>{label}</span>
        <div className="inline-flex text-xs px-4 py-3 rounded-md border border-slate-300">
          <span
            className="text-xs py-1 px-2 rounded-md whitespace-nowrap leading-none"
            style={{
              backgroundColor: color["bg-color"],
              color: color["text-color"],
            }}
          >
            {label}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span>Text Color</span>
        <div className="flex flex-row gap-2 items-center justify-between px-4 py-2 rounded-md border border-slate-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <input
            type="color"
            value={color["text-color"]}
            onChange={(e) => handleColorInput(e, "text-color")}
            className="appearance-none w-6 h-6 rounded-md border border-gray-300 cursor-pointer p-0"
          />
          <input
            type="text"
            value={color["text-color"]}
            onChange={(e) => handleHexInput(e, "text-color")}
            placeholder="#000000"
            className="flex-1 px-4 w-28 text-sm focus:outline-none cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span>Bg Color</span>
        <div className="flex flex-row gap-2 items-center justify-between px-4 py-2 rounded-md border border-slate-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <input
            type="color"
            value={color["bg-color"]}
            onChange={(e) => handleColorInput(e, "bg-color")}
            className="appearance-none w-6 h-6 rounded-md border border-gray-300 cursor-pointer p-0"
          />
          <input
            type="text"
            value={color["bg-color"]}
            onChange={(e) => handleHexInput(e, "bg-color")}
            placeholder="#000000"
            className="flex-1 px-4 w-28 text-sm focus:outline-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ColorPicker);
