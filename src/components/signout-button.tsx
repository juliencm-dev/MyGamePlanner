"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export function SignOutButton() {
  return (
    <Button
      className='w-full '
      variant={"ghost"}
      onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </Button>
  );
}
