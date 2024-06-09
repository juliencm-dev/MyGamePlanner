"use client";

import { updateUserAttendanceAction } from "@/app/(protected)/groups/[groupId]/_actions/update-user-attendance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { socket } from "@/components/websocket/socket";
import { GroupDataProps, useGroup } from "@/context/group-context";
import {
  Attendance,
  EventConfirmationDto,
  EventDto,
} from "@/use-case/events/types";
import { createId } from "@paralleldrive/cuid2";
import { CheckIcon, Cross1Icon, QuestionMarkIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { toast } from "sonner";

function AttendanceSelectContent({
  icon,
  text,
}: {
  icon: JSX.Element;
  text: string;
}) {
  return (
    <div className='flex gap-2'>
      {icon}
      <span className='self-center'>{text}</span>
    </div>
  );
}

export function UserAttendanceConfirmation({
  event,
  currentUserConfirmation,
}: {
  event: EventDto;
  currentUserConfirmation: Attendance;
}) {
  const { loggedInUser, group } = useGroup() as GroupDataProps;
  const [isPending, startTransition] = useTransition();

  function handleUserAttendanceConfirmation(value: Attendance) {
    startTransition(async () => {
      const userAttendance = {
        userId: loggedInUser.id,
        eventId: event.id,
        attending: value,
      } as EventConfirmationDto;

      await updateUserAttendanceAction({
        userAttendanceDto: userAttendance,
        groupId: event.groupId,
      }).then((res) => {
        if (res) {
          socket.emit("groupUpdate", { target: group.id });
          toast("Success", {
            description: res.message,
          });
        } else {
          toast.error("Error", {
            description: "Could not update member role",
          });
        }
      });
    });
  }

  const confirmationStatusMap = new Map<Attendance, JSX.Element>();

  confirmationStatusMap.set(
    Attendance.PENDING,
    <AttendanceSelectContent
      key={createId()}
      icon={<QuestionMarkIcon className='w-4 h-5 text-yellow-500' />}
      text={"Pending"}
    />
  );
  confirmationStatusMap.set(
    Attendance.CONFIRMED,
    <AttendanceSelectContent
      key={createId()}
      icon={<CheckIcon className='w-4 h-4 text-green-500' />}
      text={"Confirmed"}
    />
  );
  confirmationStatusMap.set(
    Attendance.ABSENT,
    <AttendanceSelectContent
      key={createId()}
      icon={<Cross1Icon className='w-4 h-4 text-red-500' />}
      text={"Absent"}
    />
  );

  return (
    <div className='absolute right-5 bottom-3'>
      <Select
        onValueChange={(value) =>
          handleUserAttendanceConfirmation(Number(value) as Attendance)
        }
        value={handleUserAttendanceConfirmation.toString()}
        disabled={isPending}>
        <SelectTrigger className='border-accent-foreground/20 text-accent-foreground'>
          {confirmationStatusMap.get(currentUserConfirmation)}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={Attendance.PENDING.toString()}>
            {confirmationStatusMap.get(Attendance.PENDING)}
          </SelectItem>
          <SelectItem value={Attendance.CONFIRMED.toString()}>
            {confirmationStatusMap.get(Attendance.CONFIRMED)}
          </SelectItem>
          <SelectItem value={Attendance.ABSENT.toString()}>
            {confirmationStatusMap.get(Attendance.ABSENT)}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
