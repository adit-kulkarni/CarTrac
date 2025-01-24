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
        className={`${i <= rating ? "text-yellow-500" : "text-gray-400"} cursor-pointer`}
      >
        ★
      </span>,
    );
  }
  return <div className="flex">{stars}</div>;
}
}
