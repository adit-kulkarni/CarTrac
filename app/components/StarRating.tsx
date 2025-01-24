
"use client";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
}

export default function StarRating({ rating, onRate }: StarRatingProps) {
  const stars = [...Array(5)].map((_, index) => (
    <span
      key={index}
      onClick={() => onRate?.(index + 1)}
      style={{ cursor: onRate ? 'pointer' : 'default' }}
      className={`text-2xl ${
        index < rating ? 'text-yellow-500' : 'text-gray-400'
      }`}
    >
      ★
    </span>
  ));

  return <div className="flex">{stars}</div>;
}
