import * as React from "react";

export const Slider = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <input
    type="range"
    min={0}
    max={100}
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className="w-full accent-[#06B6D4]"
  />
);
