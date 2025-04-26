import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
  minWidth?: number;
  maxWidth?: number;
}

export function Sidebar({
  children,
  minWidth = 200,
  maxWidth = 300,
}: SidebarProps) {
  return (
    <div
      className="min-h-screen bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto"
      style={{
        minWidth: `${minWidth}px`,
        maxWidth: `${maxWidth}px`,
        width: "20vw",
      }}>
      {children}
    </div>
  );
}
