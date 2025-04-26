"use client";

import "./globals.css";
import NavWrapper from "@/components/NavWrapper";
import { SessionProvider } from "next-auth/react";
import Modal from "react-modal";
import { useEffect } from "react";

// react-modal ke liye app element set karo
if (typeof window !== "undefined") {
  Modal.setAppElement("#root");
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <NavWrapper />
          <div id="root">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
