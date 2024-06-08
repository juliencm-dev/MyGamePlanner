import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { GroupDataProps, useGroup } from "@/context/group-context";
import { Attendance, type EventConfirmationDto } from "@/use-case/events/types";

import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

export function MembersAttendanceList({
  confirmations,
}: {
  confirmations: EventConfirmationDto[];
}) {
  const { members } = useGroup() as GroupDataProps;
  const attendanceMap = new Map<string, Attendance>();
  confirmations.forEach((confirmation) => {
    attendanceMap.set(confirmation.userId, confirmation.attending);
  });

  const sortedMembers = members.slice().sort((a, b) => {
    const statusA = attendanceMap.get(a.id) ?? Attendance.PENDING;
    const statusB = attendanceMap.get(b.id) ?? Attendance.PENDING;

    return statusA - statusB;
  });

  return (
    <div className='flex flex-col mt-2'>
      <h2 className='font-semibold'>Attendance:</h2>
      <ScrollArea className='w-[25rem] whitespace-nowrap h-fit'>
        <div className='flex space-x-2 py-2 w-max'>
          {sortedMembers.map((member) => (
            <div
              className='relative'
              key={member.id}>
              <Avatar>
                <AvatarImage
                  src={member.image}
                  alt={member.name}
                />
              </Avatar>
              {confirmations.map((confirmation) => {
                if (confirmation.userId === member.id) {
                  switch (confirmation.attending) {
                    case Attendance.PENDING:
                      return (
                        <div
                          key={crypto.randomUUID()}
                          className='absolute inset-0 bg-black bg-opacity-70 filter blur-full rounded-full'></div>
                      );
                    case Attendance.CONFIRMED:
                      return (
                        <CheckIcon
                          key={crypto.randomUUID()}
                          className='absolute w-7 h-7 text-green-500 bottom-[-5px] right-[-5px]'
                        />
                      );
                    case Attendance.ABSENT:
                      return (
                        <div
                          key={crypto.randomUUID()}
                          className='absolute inset-0 bg-black bg-opacity-70 filter blur-full rounded-full'>
                          <Cross1Icon className='absolute w-4 h-4 text-red-500 bottom-0 right-0' />
                        </div>
                      );
                  }
                }
              })}
            </div>
          ))}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  );
}
