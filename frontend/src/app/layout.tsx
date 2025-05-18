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
          <div className="mx-auto flex w-[80%] flex-col items-center py-10">
            {children}
          </div>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
