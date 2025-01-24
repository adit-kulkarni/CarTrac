"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { Car } from "@/app/page";
import StarRating from "@/app/components/StarRating";

export default function CarDetails() {
  const router = useRouter(); // Used by the Go Back button
  const [car, setCar] = useState<Car | null>(null);
  const { carId } = useParams();

  const [ratings, setRatings] = useState<{
    comfort: number;
    drivingExperience: number;
    stylishness: number;
  }>({
    comfort: car?.comfort || 0,
    drivingExperience: car?.drivingExperience || 0,
    stylishness: car?.stylishness || 0,
  });

  useEffect(() => {
    const fetchCar = async () => {
      if (carId) {
        const carDocRef = doc(db, "cars", carId);
        const carDocSnap = await getDoc(carDocRef);
        if (carDocSnap.exists()) {
          setCar({ ...carDocSnap.data(), id: carId } as Car);
          setRatings({
            comfort: carDocSnap.data().comfort || 0,
            drivingExperience: carDocSnap.data().drivingExperience || 0,
            stylishness: carDocSnap.data().stylishness || 0,
          });
        } else {
          console.log("Car not found");
        }
      }
    };
    fetchCar();
  }, [carId]);

  const handleRate = (attribute: string, newRating: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [attribute]: newRating,
    }));
  };

  const handleSaveRatings = async () => {
    if (car && car.id) {
      try {
        const carDocRef = doc(db, "cars", car.id);
        await updateDoc(carDocRef, {
          comfort: ratings.comfort,
          drivingExperience: ratings.drivingExperience,
          stylishness: ratings.stylishness,
        });
        console.log("Ratings updated successfully");
      } catch (error) {
        console.error("Error updating ratings:", error);
      }
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <button
        onClick={() => router.push("/")} // Go back to home
        className="mt-4 bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition"
      >
        Go Back
      </button>
      <h1 className="text-4xl font-extrabold text-center mb-6 tracking-wide">
        Car Details
      </h1>
      <div
        className="relative bg-gray-800 p-6 rounded-lg shadow-lg"
        style={{
          backgroundImage: `url('${car.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black bg-opacity-60 p-4 rounded">
          <h3 className="text-xl font-bold text-white">
            {car.make} {car.model}
          </h3>
          <p className="text-gray-300">Year: {car.year}</p>
          <p className="text-gray-300">Top Speed: {car.topSpeed} km/h</p>
          <p className="text-gray-300">Rating: {car.rating}/5</p>
          <p className="text-gray-300">
            Roles: {car.roles?.length > 0 ? car.roles.join(", ") : "None"}
          </p>

          <div className="mt-4">
            <div className="mb-2">
              <label className="block text-gray-300 font-bold mb-1">
                Comfort:
              </label>
              <StarRating
                rating={ratings.comfort}
                onRate={(newRating) => handleRate("comfort", newRating)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-300 font-bold mb-1">
                Driving Experience:
              </label>
              <StarRating
                rating={ratings.drivingExperience}
                onRate={(newRating) =>
                  handleRate("drivingExperience", newRating)
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-300 font-bold mb-1">
                Stylishness:
              </label>
              <StarRating
                rating={ratings.stylishness}
                onRate={(newRating) => handleRate("stylishness", newRating)}
              />
            </div>
            <button
              onClick={handleSaveRatings}
              className="mt-4 bg-blue-600 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition"
            >
              Save Ratings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
