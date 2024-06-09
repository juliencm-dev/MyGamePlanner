import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/components/navigation/header";
import { Toaster } from "@/components/ui/toaster";
import { SocketConnector } from "@/components/websocket/socket-connector";
import { getUserGroups } from "@/db/data-access/groups";
import { getCurrentUser } from "@/db/data-access/user";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Group Game Planner",
  description: "Plan your next adventure with ease.",
};

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userGroups = await getUserGroups();
  const userId = (await getCurrentUser()).id as string;
  const userGroupIds = userGroups.map((group) => group.id as string);

  return (
    <html lang='en'>
      <body className={inter.className}>
        <main className='grid space-y-20'>
          <Header />
          {children}
        </main>
        <Toaster />
        <SocketConnector
          userId={userId}
          userGroupIds={userGroupIds}
        />
      </body>
    </html>
  );
}
