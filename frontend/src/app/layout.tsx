import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Webreg++",
  description: "A better way to schedule your classes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="emotion-insertion-point"
          content="emotion-insertion-point"
        />
      </head>
      <body>
        <Navbar />
        <div className="w-[80%] mx-auto pt-10 flex flex-col items-center">
          {children}
        </div>
      </body>
    </html>
  );
}
