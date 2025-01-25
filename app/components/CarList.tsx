
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import StarRating from "./StarRating";
import { Car } from "../page";

interface CarListProps {
  cars: Car[];
  onDelete: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onRate: (carId: string, attribute: string, newRating: number) => Promise<void>;
  setIsFormVisible: (value: boolean) => void;
}

export default function CarList({ cars, onDelete, onRate, setIsFormVisible }: CarListProps) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div
          key={car.id}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
          onClick={() => { if (car.id) router.push(`/car/${car.id}`); }}
        >
          <Image
            src={car.image}
            alt={`${car.make} ${car.model}`}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold">
              {car.make} {car.model}
            </h3>
            <p>Year: {car.year}</p>
            <p>Top Speed: {car.topSpeed} km/h</p>
            <div className="flex items-center">
              <span className="mr-2">Rating:</span>
              <StarRating
                rating={car.rating}
                onRate={(newRating) => {
                  if (car.id) {
                    onRate(car.id, "rating", newRating);
                  }
                }}
              />
            </div>
            <p>
              Roles: {car.roles?.length > 0 ? car.roles.join(", ") : "None"}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                car.id && onDelete(car.id, e);
              }}
              className="mt-2 bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <div
        onClick={() => {
          setIsFormVisible(true);
          router.push('/?addNew=true');
        }}
        className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer min-h-[400px] flex items-center justify-center group hover:bg-gray-700 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-600 group-hover:text-gray-400 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
    </div>
  );
}
