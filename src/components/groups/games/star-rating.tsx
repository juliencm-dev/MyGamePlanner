"use client";

import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

export function StarRating({
  totalStars = 5,
  rating,
  setRating,
}: {
  totalStars?: number;
  rating: number;
  setRating: (value: number) => void;
}) {
  return (
    <div className='flex gap-2 font-2xl my-10'>
      {[...Array(totalStars)].map((_, index) => {
        if (index < rating) {
          return (
            <StarFilledIcon
              className='cursor-pointer'
              width={50}
              height={50}
              key={index}
              onClick={() => setRating(index + 1)}
            />
          );
        } else {
          return (
            <StarIcon
              className='cursor-pointer'
              width={50}
              height={50}
              key={index}
              onClick={() => setRating(index + 1)}
            />
          );
        }
      })}
    </div>
  );
}
