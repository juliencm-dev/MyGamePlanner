"use client";
import { DEFAULT_REDIRECT_URL } from "@/route";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { DiscordLogoIcon } from "@radix-ui/react-icons";

export function DiscordButton() {
  return (
    <Button className="px-8 py-5 bg-violet-500 hover:bg-violet-600 text-stone-100 flex gap-2 text-center" variant={"gooeyLeft"} onClick={() => signIn("discord")}>
      <DiscordLogoIcon className="w-5 h-5" />
      Sign in with Discord
    </Button>
  );
}
