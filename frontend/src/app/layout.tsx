import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
