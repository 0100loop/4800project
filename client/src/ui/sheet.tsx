import * as React from "react";

export const Sheet = ({
  open,
  children,
  onClose,
}: {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-4">
        {children}
      </div>
    </>
  );
};
