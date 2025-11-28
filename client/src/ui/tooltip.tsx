import * as React from "react";

export const Tooltip = ({
  trigger,
  content,
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {trigger}

      {open && (
        <div className="absolute z-50 bg-black text-white text-xs p-2 rounded-md mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
};
