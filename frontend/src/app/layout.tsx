import type { Metadata } from "next";
import { PrimeReactProvider } from "primereact/api";

import "./globals.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Webreg++ | Smarter UCSD Class Scheduling",
  description:
    "Automate your UCSD course registration with Webreg++ — an intelligent class scheduler that builds the perfect schedule with one click.",
  keywords: [
    "UCSD",
    "Webreg",
    "course scheduler",
    "class registration",
    "Webreg++",
    "UCSD schedule builder",
    "webregplusplus",
    "UCSD tech tools",
    "auto scheduler",
  ],
  authors: [
    { name: "Yixuan Li", url: "https://github.com/yxli001" },
    { name: "Brandon Jonathan", url: "https://github.com/b-jonathan" },
  ],
  metadataBase: new URL("https://webregplusplus.tech"),
  openGraph: {
    title: "Webreg++ | UCSD Schedule Optimizer",
    description:
      "Automate your class schedule with Webreg++ — the smarter way to register at UCSD.",
    url: "https://webregplusplus.tech",
    siteName: "Webreg++",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Webreg++: UCSD Class Scheduling Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webreg++ | Smarter UCSD Class Scheduling",
    description:
      "Automate your class schedule with Webreg++ — the smarter way to register at UCSD.",
    images: ["/og-image.png"],
  },
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
        <PrimeReactProvider>
          <Navbar />
          <div className="mx-auto flex w-[80%] flex-col items-center py-10">
            {children}
          </div>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
