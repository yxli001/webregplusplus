import type { Metadata } from "next";

import { PrimeReactProvider } from "primereact/api";

import "./globals.css";

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
        <PrimeReactProvider
          value={{
            unstyled: true,
          }}
        >
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
