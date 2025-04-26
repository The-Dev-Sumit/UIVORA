import { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return <main className="flex-1 overflow-y-auto">{children}</main>;
}
