import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ModalProvider from "@/components/modals/modal-provider";
import { Public_Sans } from "next/font/google";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal Finance",
  description:
    "Personal finance tracker,manage your money with ease and simplicity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${publicSans.className} antialiased `}>
        <SessionProvider>
          <Toaster />
          <ModalProvider />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
