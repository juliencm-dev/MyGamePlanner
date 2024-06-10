import { auth } from "@/auth";
import { DiscordButton } from "@/components/discord-button";
import { GoogleButton } from "@/components/google-button";
import { redirect } from "next/navigation";

export default async function Home() {
  const { getUser } = await auth();
  const user = getUser();

  if (user) redirect("/dashboard");

  return (
    <div className='container grid h-screen place-content-center gap-10 '>
      <div className='text-center flex flex-col gap-8 border border-stone-400 p-12 rounded-lg min-w-[450px]'>
        <div className='text-center flex flex-col gap-2'>
          <h1 className='font-semibold text-2xl'>My Game Planner</h1>
          <h2 className='text-md text-muted-foreground'>
            Setup your next adventure with ease.
          </h2>
        </div>
        <div className='flex flex-col w-full gap-6 border border-stone-400 bg-muted-foreground/10 p-4 rounded-lg'>
          <h3 className='font-semibold text-xl'>Sign in to get started</h3>
          <div className='flex flex-col gap-2'>
            <GoogleButton />
            <DiscordButton />
          </div>
        </div>
      </div>
    </div>
  );
}
