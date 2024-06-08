"use client";

import { toast } from "sonner";
import { CopyIcon } from "@radix-ui/react-icons";

export function CopyButton({ text }: { text: string }) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    toast("Copied to clipboard!", {
      description: "You can use this link to invite others to your group.",
    });
  };

  return (
    <div onClick={copyToClipboard}>
      <CopyIcon
        className='cursor-pointer'
        width={25}
        height={25}
      />
    </div>
  );
}
