import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Steve Zhu | Software Engineer",
  description:
    "Software Engineer at Meta. Building intelligent systems at the intersection of AI and engineering. Columbia CS, Stanford AI.",
  keywords: [
    "Steve Zhu",
    "Software Engineer",
    "AI Engineer",
    "Meta",
    "Machine Learning",
    "New York",
  ],
  openGraph: {
    title: "Steve Zhu | Software Engineer",
    description:
      "Software Engineer at Meta. Building intelligent systems at the intersection of AI and engineering.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-zinc-950 antialiased">{children}</body>
    </html>
  );
}
