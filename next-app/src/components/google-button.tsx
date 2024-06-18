"use client";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { GoogleLogoIcon } from "./google-icon";

export function GoogleButton() {
  return (
    <Button className="px-8 py-5 bg-white hover:bg-gray-100 text-gray-800 flex gap-1 text-center" variant={"gooeyLeft"} onClick={() => signIn("google")}>
      <GoogleLogoIcon className="w-6 h-6" />
      Sign in with Google
    </Button>
  );
}
