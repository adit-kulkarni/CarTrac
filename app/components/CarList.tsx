"use client";

import { useRouter } from "next/navigation";
import StarRating from "./StarRating";
import { Car } from "../page";

interface CarListProps {
  cars: Car[];
  onDelete: (id: string, e: React.MouseEvent) => void;
  onRate: (carId: string, attribute: string, newRating: number) => void;
}

export default function CarList({ cars, onDelete, onRate }: CarListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div
          key={car.id}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
          onClick={() => router.push(`/car/${car.id}`)}
        >
          <img
            src={car.image}
            alt={`${car.make} ${car.model}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold">
              {car.make} {car.model}
            </h3>
            <p>Year: {car.year}</p>
            <p>Top Speed: {car.topSpeed} km/h</p>
            <p>Rating: {car.rating}/5</p>
            <p>
              Roles: {car.roles?.length > 0 ? car.roles.join(", ") : "None"}
            </p>
            <button
              onClick={(e) => onDelete(car.id!, e)}
              className="mt-2 bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}