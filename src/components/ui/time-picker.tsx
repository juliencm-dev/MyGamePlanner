import { useState, useEffect } from "react";
import { TimeSelector, TimeSelectorProps } from "./time-selector";

type TimePickerProps = {
  date: Date | undefined;
  onChange: (date: Date) => void;
};

export function TimePicker({ date, onChange }: TimePickerProps) {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [amPm, setAmPm] = useState("AM");

  const timeSelectorProps = {
    hours,
    minutes,
    amPm,
    setHours,
    setMinutes,
    setAmPm,
  } as TimeSelectorProps;

  useEffect(() => {
    const adjustedHours =
      amPm === "PM" && hours !== 12
        ? hours + 12
        : amPm === "AM" && hours === 12
        ? 0
        : hours;

    const newDate = date ? new Date(date) : new Date();

    newDate.setMinutes(minutes);
    newDate.setHours(adjustedHours);
    onChange(newDate);
  }, [hours, minutes, amPm]);

  return (
    <div className='flex gap-2 self-center mb-4 z-50'>
      <TimeSelector props={timeSelectorProps} />
    </div>
  );
}
