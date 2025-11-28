import * as React from "react";

type ChartPoint = { label: string; value: number };

export const SimpleChart = ({
  data,
  title,
}: {
  data: ChartPoint[];
  title?: string;
}) => (
  <div className="p-4 border rounded-lg bg-white shadow-sm">
    {title && (
      <h3 className="text-lg font-medium text-[#0A2540] mb-3">{title}</h3>
    )}

    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between text-sm mb-1">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#06B6D4] transition-all"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);
