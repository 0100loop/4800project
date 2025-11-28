import * as React from "react";

export const ContextMenu = ({
  children,
  items,
}: {
  children: React.ReactNode;
  items: { label: string; onClick: () => void }[];
}) => {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  const openMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  return (
    <>
      <div onContextMenu={openMenu}>{children}</div>

      {open && (
        <div
          className="fixed bg-white border rounded-md shadow-md p-1 z-50"
          style={{ left: pos.x, top: pos.y }}
          onClick={() => setOpen(false)}
        >
          {items.map((i, idx) => (
            <button
              key={idx}
              onClick={i.onClick}
              className="block w-full px-3 py-1 text-left text-sm hover:bg-gray-100"
            >
              {i.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};
