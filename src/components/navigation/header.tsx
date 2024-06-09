import Image from "next/image";

import { auth } from "@/auth";
import { getCurrentUser } from "@/db/data-access/user";
import { type UserDto } from "@/db/data-access/dto/users/types";
import { SignOutButton } from "@/components/signout-button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Navigation } from "@/components/navigation/navigation";

export async function Header() {
  const { getUser } = await auth();
  const user = getUser();

  if (!user) return null;

  const currentUser: UserDto = await getCurrentUser();

  return (
    <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <Navigation className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6' />
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='shrink-0 md:hidden'>
            <HamburgerMenuIcon className='h-5 w-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <Navigation className='grid gap-6 text-lg font-medium' />
        </SheetContent>
      </Sheet>
      <div className='flex gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='secondary'
              size='icon'
              className='rounded-full justify-self-end'>
              <Image
                src={currentUser.image}
                alt={currentUser.name}
                width={50}
                height={50}
                className='rounded-full'
              />
              <span className='sr-only'>Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='min-w-[200px]'>
            <div className='flex flex-col items-end px-2'>
              <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
              <DropdownMenuLabel className='text-xs font-extralight mt-[-10px]'>
                {currentUser.email}
              </DropdownMenuLabel>
            </div>
            <DropdownMenuSeparator />
            <SignOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
