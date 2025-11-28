import * as React from "react";

interface AccordionProps {
  children: React.ReactNode;
}

export const Accordion = ({ children }: AccordionProps) => {
  return <div className="w-full">{children}</div>;
};

export const AccordionItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`border-b py-3 ${className}`}>{children}</div>;
};

export const AccordionTrigger = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center font-medium py-2 ${className}`}
    >
      {children}
      <span className="ml-2">▼</span>
    </button>
  );
};

export const AccordionContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`text-sm text-gray-600 py-2 ${className}`}>{children}</div>;
};
