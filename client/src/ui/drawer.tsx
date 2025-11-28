import * as React from "react";

export const Drawer = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="ml-auto w-80 h-full bg-white shadow-xl z-50 p-4">
        {children}
      </div>
    </div>
  );
};
