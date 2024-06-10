import { type GroupDto } from "@/db/data-access/dto/groups/types";
import Link from "next/link";
import { AddGroupToFavorites } from "@/components/groups/add-group-to-favorites";
import { cn } from "@/lib/utils";

export function GroupCard({
  group,
  inFavorites = false,
  className,
}: {
  group: GroupDto;
  inFavorites?: boolean;
  className?: string;
}) {
  return (
    <div className='relative'>
      <Link
        href={`/groups/${group.id}`}
        className={cn(
          "grid h-[300px] sm:w-[300px] sm:h-[300px] bg-gradient-to-t border rounded-lg cursor-pointer bg-card relative z-0 overflow-hidden transition-all duration-250 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-t from-secondary/10 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
          className
        )}>
        <div className='flex flex-col gap-8 p-4 my-auto'>
          <h2 className='text-2xl font-semibold text-center'>{group.name}</h2>
          <p className='text-sm text-center text-muted-foreground'>
            {group.description}
          </p>
        </div>
      </Link>
      {!inFavorites && <AddGroupToFavorites group={group} />}
    </div>
  );
}
