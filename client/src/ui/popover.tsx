import * as React from "react";

export const Popover = ({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {open && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow p-3 min-w-[200px]">
          {children}
        </div>
      )}
    </div>
  );
};
