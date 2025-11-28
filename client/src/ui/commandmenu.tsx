import * as React from "react";

export const CommandMenu = ({
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
    <div className="fixed inset-0 bg-black/40 flex justify-center pt-40 z-50">
      <div className="bg-white w-full max-w-md rounded-md shadow-lg p-4">
        <input
          placeholder="Search commands..."
          className="w-full px-3 py-2 border rounded-md mb-3 text-sm"
        />
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
};

export const CommandMenuItem = ({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
}) => (
  <button
    onClick={onSelect}
    className="w-full px-3 py-2 text-sm rounded hover:bg-gray-100 text-left"
  >
    {children}
  </button>
);
