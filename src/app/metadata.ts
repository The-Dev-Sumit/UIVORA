import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "Uivora",
    default: "Uivora",
    template: "%s | Uivora",
  },
  description: "The Ultimate UI Component Library.",
  icons: {
    icon: "/page-icon.png",
    shortcut: "/page-icon.png",
    apple: "/page-icon.png",
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};
