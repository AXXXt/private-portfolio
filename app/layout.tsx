import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "An Xitong | Creative Fullstack Engineer",
  description:
    "Personal portfolio showcasing fullstack development, network engineering, and creative tech experiences.",
  keywords: ["Next.js", "React 19", "GSAP", "Fullstack", "Network Engineering", "Portfolio"],
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="bg-black text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
