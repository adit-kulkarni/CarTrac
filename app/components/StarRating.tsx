
"use client";

interface StarRatingProps {
  rating: number;
  onRate: (newRating: number) => void;
}

export default function StarRating({ rating, onRate }: StarRatingProps) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        onClick={() => onRate(i)}
        className={`cursor-pointer ${
          i <= rating ? "text-yellow-500" : "text-gray-400"
        }`}
      >
        ★
      </span>,
    );
  }
  return <div className="flex">{stars}</div>;
}
