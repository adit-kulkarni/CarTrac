
"use client";

import { useRouter } from "next/navigation";
import StarRating from "./StarRating";
import { Car } from "../page";

interface CarListProps {
  cars: Car[];
  onDelete: (carId: string, e: React.MouseEvent) => void;
  onRate: (carId: string, attribute: string, newRating: number) => void;
}

export default function CarList({ cars, onDelete, onRate }: CarListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-6">
      {cars.map((car, index) => (
        <div
          key={index}
          className={`relative bg-gray-800 p-6 rounded-lg shadow-lg h-48 flex flex-col items-start justify-center hover:translate-y-[-2px] transition duration-300 ease-in-out cursor-pointer`}
          style={{
            backgroundColor: '#1f2937',
          }}
          onClick={() => {
            if (car.id) {
              router.push(`/car/${car.id}`);
            }
          }}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-30 p-4 rounded flex flex-col items-start justify-center"
            style={{
              backgroundImage: car.image ? `url('${car.image}')` : 'none',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-full">
                <h3 className="text-xl font-bold text-white">
                  {car.make} {car.model}
                </h3>
                <p className="text-gray-300">Year: {car.year}</p>
                <p className="text-gray-300">
                  Top Speed: {car.topSpeed} km/h
                </p>
                <p className="text-gray-300">Rating: </p>
                <StarRating
                  rating={car.rating}
                  onRate={(newRating) =>
                    onRate(car.id!, "rating", newRating)
                  }
                />
                <p className="text-gray-300">
                  Roles:{" "}
                  {car.roles?.length > 0 ? car.roles.join(", ") : "None"}
                </p>
              </div>
              <div className="flex flex-row-reverse items-start">
                <button
                  onClick={(e) => onDelete(car.id!, e)}
                  className="mt-4 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
