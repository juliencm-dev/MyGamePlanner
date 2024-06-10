import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function GroupCardLoading() {
  return (
    <div className='relative'>
      <div
        className={cn(
          "grid h-[300px] sm:w-[300px] sm:h-[300px] border border-secondary/30 rounded-lg cursor-pointer bg-card animate-pulse"
        )}>
        <div className='flex flex-col gap-8 p-4 align-center m-auto'>
          <Skeleton className='h-8 w-44 self-center rounded-lg' />
          <Skeleton className='h-20 w-60 self-center rounded-lg' />
        </div>
      </div>
    </div>
  );
}
