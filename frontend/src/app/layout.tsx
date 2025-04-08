import type { Metadata } from "next";
import { PrimeReactProvider } from "primereact/api";

import "./globals.css";
import "primereact/resources/primereact.min.css";
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
        <PrimeReactProvider value={{ unstyled: true }}>
          <Navbar />
          <div className="w-[80%] mx-auto py-10 flex flex-col items-center">
            {children}
          </div>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
