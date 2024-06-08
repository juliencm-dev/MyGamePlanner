import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/components/navigation/header";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { Loading } from "@/components/loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Group Game Planner",
  description: "Plan your next adventure with ease.",
};

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <main className='grid space-y-20'>
          <Header />
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
