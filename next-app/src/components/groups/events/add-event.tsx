"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { addEventAction } from "@/app/(protected)/groups/[groupId]/_actions/add-event";
import { useRef, useState, useTransition } from "react";
import { PulseLoader } from "react-spinners";
import { Selector } from "@/components/selector";
import { Checkbox } from "@/components/ui/checkbox";
import { AvailablePlayersProps, DatePicker } from "@/components/ui/date-picker";
import { type GroupDataProps, useGroup } from "@/context/group-context";
import { getAvailablePlayerProps } from "@/lib/availabilities/utils";
import { useToast } from "@/components/ui/use-toast";
import { socket } from "@/components/websocket/socket";

export function AddEvent({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { group, members, games, loggedInUser } = useGroup() as GroupDataProps;

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const [selectedGameName, setSelectedGameName] = useState<string>("");

  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedMemberName, setSelectedMemberName] = useState<string>("");

  const [mpChecked, setMpChecked] = useState(false);
  const [recurringChecked, setRecurringChecked] = useState(false);

  const players: AvailablePlayersProps = getAvailablePlayerProps({
    mandatoryPlayerId: selectedMemberId,
    members: members,
    minPLayers: games.find((g) => selectedGameId === g.id)?.minPlayers || 0,
  });

  function resetEventForm() {
    nameRef.current!.value = "";
    descriptionRef.current!.value = "";
    setSelectedGameId("");
    setSelectedGameName("");
    setSelectedMemberId("");
    setSelectedMemberName("");
    setMpChecked(false);
    setRecurringChecked(false);
  }

  function handleAddEvent() {
    const formData = new FormData();

    formData.append("name", nameRef.current?.value as string);
    formData.append("description", descriptionRef.current?.value as string);
    formData.append("gameId", selectedGameId);
    formData.append("mandatoryPlayerId", selectedMemberId);
    formData.append("groupId", group.id as string);

    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Start and end date are required",
      });
      return;
    }

    startTransition(async () => {
      await addEventAction({
        formData,
        startDate,
        endDate,
        members,
        user: loggedInUser,
      }).then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            description: res.message,
          });

          if (res.notification) {
            socket.emit("notification", res.notification);
          }

          setOpen(false);
          resetEventForm();
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: res.message,
          });
        }
      });
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setStartDate(undefined);
        setEndDate(undefined);
        setMpChecked(false);
        setRecurringChecked(false);
      }}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side='right'>
        <div className='grid gap-4 px-2 mt-12'>
          <h2 className='text-lg font-semibold'>Add Event</h2>
          <p className='text-sm font-light'>
            Add an event to the group calendar. All group members will be able
            to confirm their participation. A game is required to create an
            event.
          </p>
          <div className='flex flex-col gap-4 mt-6'>
            <Label>Name</Label>
            <Input
              ref={nameRef}
              name='name'
              type='text'
              required
            />
          </div>
          <div className='flex flex-col gap-4'>
            <Label>Description</Label>
            <Textarea
              ref={descriptionRef}
              name='description'
              maxLength={288}
              className='h-48 resize-none'
              required
            />
          </div>
          <div className='flex flex-col gap-4'>
            <Label>Game</Label>
            <Selector
              placeholder={["Available games list", "games"]}
              data={games}
              selectedId={selectedGameId}
              setSelectedId={setSelectedGameId}
              setSelectedName={setSelectedGameName}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <Label>Start Date & Time</Label>
            <DatePicker
              players={players}
              date={startDate}
              setEndDate={setEndDate}
              setDate={setStartDate}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <Label>End Date & Time</Label>
            <DatePicker
              players={players}
              date={endDate}
              setDate={setEndDate}
            />
          </div>
          <fieldset className='flex flex-col gap-4 mt-5 border p-4 rounded-lg'>
            <legend className='px-1'>Optionnal parameters</legend>
            <div className='flex gap-2'>
              <Checkbox
                onCheckedChange={() => {
                  if (mpChecked) {
                    setSelectedMemberId("");
                    setSelectedMemberName("");
                  }
                  setMpChecked(!mpChecked);
                }}
              />
              <Label className='self-center'>Mandatory Player </Label>
            </div>
            {mpChecked && (
              <Selector
                placeholder={["Available members list", "members"]}
                data={members}
                selectedId={selectedMemberId}
                setSelectedId={setSelectedMemberId}
                setSelectedName={setSelectedMemberName}
              />
            )}
            <div className='flex gap-2'>
              <Checkbox
                onCheckedChange={() => setRecurringChecked(!recurringChecked)}
              />
              <Label className='self-center'>Recurring Event </Label>
            </div>
          </fieldset>
          <Button
            onClick={handleAddEvent}
            className='mt-5'>
            {isPending ? <PulseLoader size={4} /> : "Add Event"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
