import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";

export type TimeSelectorProps = {
  hours: number;
  minutes: number;
  amPm: "AM" | "PM";
  setHours: (hours: number) => void;
  setMinutes: (minutes: number) => void;
  setAmPm: (amPm: "AM" | "PM") => void;
};

export function TimeSelector({ props }: { props: TimeSelectorProps }) {
  const selectHoursItems = Array.from({ length: 12 }, (_, i) => {
    const value = (i === 0 ? 12 : i).toString().padStart(2, "0");
    return {
      value,
      label: value,
    };
  });

  const selectMinutesItems = Array.from({ length: 60 }, (_, i) => {
    const value = i.toString().padStart(2, "0");
    return {
      value,
      label: value,
    };
  });
  return (
    <div className='flex gap-1'>
      <Select
        onValueChange={(value) => props.setHours(Number(value))}
        value={props.hours.toString().padStart(2, "0")}>
        <SelectTrigger className='border-accent-foreground/20 text-accent-foreground'>
          {props.hours.toString().padStart(2, "0")}
        </SelectTrigger>
        <SelectContent className='h-48'>
          {selectHoursItems.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => props.setMinutes(Number(value))}
        value={props.minutes.toString().padStart(2, "0")}>
        <SelectTrigger className='border-accent-foreground/20 text-accent-foreground'>
          {props.minutes.toString().padStart(2, "0")}
        </SelectTrigger>
        <SelectContent className='h-48'>
          {selectMinutesItems.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value: "AM" | "PM") => props.setAmPm(value)}
        value={props.amPm}>
        <SelectTrigger className='border-accent-foreground/20 text-accent-foreground'>
          {props.amPm}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={"AM" as "AM" | "PM"}>AM</SelectItem>
          <SelectItem value={"PM" as "AM" | "PM"}>PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
