import * as React from "react";

export const Carousel = ({
  children,
}: {
  children: React.ReactNode[];
}) => (
  <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory px-3 py-2">
    {children.map((child, idx) => (
      <div key={idx} className="snap-start flex-shrink-0 w-64">
        {child}
      </div>
    ))}
  </div>
);
