import * as React from "react";
import { Button } from "./button";

export const AlertDialog = ({
  children,
  open,
}: {
  children: React.ReactNode;
  open: boolean;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {children}
    </div>
  );
};

export const AlertDialogContent = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">{children}</div>
);

export const AlertDialogTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => <h2 className="text-lg font-semibold mb-2">{children}</h2>;

export const AlertDialogDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => <p className="text-gray-600 text-sm mb-4">{children}</p>;

export const AlertDialogAction = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Button onClick={onClick} className="w-full mt-2">
    {children}
  </Button>
);

export const AlertDialogCancel = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Button variant="outline" onClick={onClick} className="w-full mt-2">
    {children}
  </Button>
);
