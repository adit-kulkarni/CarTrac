"use client";

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
}

export default function StarRating({ rating, onRate }: StarRatingProps) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        onClick={() => onRate(i)}
        className={`text-${i <= rating ? "yellow-500" : "gray-400"} cursor-pointer ${
          i <= rating ? "filled" : ""
        }`}
      >
        ★
      </span>,
    );
  }
  return <div className="flex">{stars}</div>;
}
