"use client";

import { cn } from "@/lib/utils";
import { Pencil2Icon } from "@radix-ui/react-icons";

export function AvatarChangeButton({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const handleChangeAvatar = () => {
    console.log("Avatar changed");
  };

  return (
    <div
      className={cn(className, "relative cursor-pointer w-fit h-fit group")}
      onClick={handleChangeAvatar}>
      {children}
      <div className='absolute inset-0 group-hover:bg-black/80 transition-color duration-300 z-10 rounded-full'></div>
      <div className='absolute inset-0 rounded-full flex items-center justify-center text-center text-sm text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 font-bold'>
        <Pencil2Icon className='w-6 h-6' />
      </div>
    </div>
  );
}
