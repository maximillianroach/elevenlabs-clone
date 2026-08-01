import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "TwelveLabs",
  description: "TwelveLabs",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>{children}</body>
    </html>
  );
}
