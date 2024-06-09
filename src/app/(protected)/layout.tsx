import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/components/navigation/header";
import { Toaster } from "@/components/ui/toaster";
import { SocketConnector } from "@/components/websocket/socket-connector";

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
        <SocketConnector />
      </body>
    </html>
  );
}
