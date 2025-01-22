"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";


const storage = getStorage();

interface Car {
  id?: string;
  make: string;
  model: string;
  year: number;
  topSpeed: number;
  rating: number;
  image: string;
  roles: string[];
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    topSpeed: "",
    rating: "",
    image: "",
    roles: [],
  });
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmSignupPassword, setConfirmSignupPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [sortOption, setSortOption] = useState<keyof Car | "">("");
  const [filters, setFilters] = useState({
    year: [1900, 2100],
    topSpeed: [0, 500],
    rating: [1, 5],
    roles: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    if (user) {
      try {
        setLoading(true);
        const carQuery = query(collection(db, "cars"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(carQuery);
        const fetchedCars: Car[] = [];
        querySnapshot.forEach((doc) => {
          fetchedCars.push({ ...(doc.data() as Car), id: doc.id });
        });
        setCars(fetchedCars);
        localStorage.setItem(`cars_${user.uid}`, JSON.stringify(fetchedCars)); // Scoped to user
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setCars([]);
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    if (user) {
      const storedCars = localStorage.getItem(`cars_${user.uid}`);
      if (storedCars) {
        setCars(JSON.parse(storedCars));
      } else {
        fetchCars();
      }
    }
  }, [user]);
  

  useEffect(() => {
    if (cars.length > 0) {
      localStorage.setItem("cars", JSON.stringify(cars));
    }
  }, [cars]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const storageRef = ref(storage, `car-images/${user.uid}/${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setForm({ ...form, image: downloadURL });
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCar = {
      make: form.make,
      model: form.model,
      year: Number(form.year),
      topSpeed: Number(form.topSpeed),
      rating: Number(form.rating),
      image: form.image,
      roles: form.roles,
    };
    if (user) {
      const carCollection = collection(db, "cars");
      const docRef = await addDoc(carCollection, { ...newCar, userId: user.uid });
      newCar.id = docRef.id;
    }
    setCars((prevCars) => [...prevCars, newCar]);
    setForm({ make: "", model: "", year: "", topSpeed: "", rating: "", image: "", roles: [] });
    setIsFormVisible(false);
  };

  const deleteCar = async (carId: string) => {
    if (user) {
      const carDoc = doc(db, "cars", carId);
      await deleteDoc(carDoc);
      setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      await fetchCars(); // Fetch user-specific cars
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please check your credentials.");
    }
  };
  
  
  

  const handleSignup = async () => {
    if (signupPassword !== confirmSignupPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;
  
      // Send email verification
      await sendEmailVerification(user);
      alert("Verification email sent! Please check your inbox.");
  
      await fetchCars();
    } catch (error) {
      console.error("Signup failed", error);
      alert("Error signing up. Please try again.");
    }
  };
  
  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setCars([]);
      localStorage.removeItem(`cars_${user?.uid}`); // Clear only the logged-in user's data
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        await fetchCars();
      } else {
        setLoading(false);
      }
    });
  
    return () => unsubscribe(); // Cleanup on component unmount
  }, []);
  

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to CarTrac</h1>
  
        {/* Sign-Up Section */}
        <div className="mb-12">
          <h2 className="text-1xl font-semibold mb-4">New to the CarTrac gang? Sign up below:</h2>
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className="block w-full max-w-md p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className="block w-full max-w-md p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmSignupPassword}
            onChange={(e) => setConfirmSignupPassword(e.target.value)}
            className="block w-full max-w-md p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={async () => {
              if (signupPassword !== confirmSignupPassword) {
                alert("Passwords do not match!");
                return;
              }
              try {
                const userCredential = await createUserWithEmailAndPassword(
                  auth,
                  signupEmail,
                  signupPassword
                );
                await sendEmailVerification(userCredential.user);
                alert("Verification email sent!");
              } catch (error) {
                console.error("Signup error", error);
                alert("Signup failed. Try again.");
              }
            }}
            className="w-full max-w-md bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </div>
  
        {/* Login Section */}
        <div>
          <h2 className="text-1xl font-semibold mb-4">Already a Car Merchant? Log in below:</h2>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="block w-full max-w-md p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="block w-full max-w-md p-3 mb-4 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={async () => {
              try {
                await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
                await fetchCars();
              } catch (error) {
                console.error("Login failed", error);
                alert("Login failed. Check your credentials.");
              }
            }}
            className="w-full max-w-md bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }
  
  
  
  

  const applyFilters = (car: Car) => {
    const roleMatch =
      filters.roles.length === 0 || filters.roles.some((role) => car.roles?.includes(role));
    return (
      roleMatch &&
      car.year >= filters.year[0] &&
      car.year <= filters.year[1] &&
      car.topSpeed >= filters.topSpeed[0] &&
      car.topSpeed <= filters.topSpeed[1] &&
      car.rating >= filters.rating[0] &&
      car.rating <= filters.rating[1]
    );
  };

  const sortedAndFilteredCars = cars
    .filter(applyFilters)
    .sort((a, b) => {
      if (!sortOption) return 0;
      if (typeof a[sortOption] === "number" && typeof b[sortOption] === "number") {
        return b[sortOption] - a[sortOption];
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-[\'Playfair Display\'] p-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 tracking-wide">Car Tracker</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition mb-6">
        Log Out
      </button>

      <h2
        className="text-2xl font-bold cursor-pointer mb-4"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        Add New Car {isFormVisible ? "-" : "+"}
      </h2>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Make"
              value={form.make}
              onChange={(e) => setForm({ ...form, make: e.target.value })}
              className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Model"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Top Speed (km/h)"
              value={form.topSpeed}
              onChange={(e) => setForm({ ...form, topSpeed: e.target.value })}
              className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Rating (1-5)"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 font-bold mb-2">Roles:</label>
            {["Driver", "Passenger", "Observed"].map((role) => (
              <div key={role} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={role}
                  checked={form.roles.includes(role)}
                  onChange={() =>
                    setForm((prevForm) => ({
                      ...prevForm,
                      roles: prevForm.roles.includes(role)
                        ? prevForm.roles.filter((r) => r !== role)
                        : [...prevForm.roles, role],
                    }))
                  }
                  className="mr-2"
                />
                <span className="text-gray-300">{role}</span>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 border border-gray-700 rounded bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Add Car
          </button>
        </form>
      )}

      <div className="mb-6">
        <label className="text-xl text-gray-200 font-bold mr-4">Filter By Year:</label>
        <input
          type="range"
          min="1900"
          max="2100"
          value={filters.year[0]}
          onChange={(e) =>
            setFilters({ ...filters, year: [Number(e.target.value), filters.year[1]] })
          }
          className="mr-2"
        />
        <input
          type="range"
          min="1900"
          max="2100"
          value={filters.year[1]}
          onChange={(e) =>
            setFilters({ ...filters, year: [filters.year[0], Number(e.target.value)] })
          }
        />
        <span className="text-gray-300 ml-2">
          {filters.year[0]} - {filters.year[1]}
        </span>
      </div>

      <div className="mb-6">
        <label className="text-xl text-gray-200 font-bold mr-4">Filter By Speed:</label>
        <input
          type="range"
          min="0"
          max="500"
          value={filters.topSpeed[0]}
          onChange={(e) =>
            setFilters({ ...filters, topSpeed: [Number(e.target.value), filters.topSpeed[1]] })
          }
          className="mr-2"
        />
        <input
          type="range"
          min="0"
          max="500"
          value={filters.topSpeed[1]}
          onChange={(e) =>
            setFilters({ ...filters, topSpeed: [filters.topSpeed[0], Number(e.target.value)] })
          }
        />
        <span className="text-gray-300 ml-2">
          {filters.topSpeed[0]} - {filters.topSpeed[1]} km/h
        </span>
      </div>

      <div className="mb-6">
        <label className="text-xl text-gray-200 font-bold mr-4">Filter By Rating:</label>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={filters.rating[0]}
          onChange={(e) =>
            setFilters({ ...filters, rating: [Number(e.target.value), filters.rating[1]] })
          }
          className="mr-2"
        />
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={filters.rating[1]}
          onChange={(e) =>
            setFilters({ ...filters, rating: [filters.rating[0], Number(e.target.value)] })
          }
        />
        <span className="text-gray-300 ml-2">
          {filters.rating[0]} - {filters.rating[1]}
        </span>
      </div>

      <div className="mb-6">
        <label className="text-xl text-gray-200 font-bold mr-4">Filter By Roles:</label>
        {["Driver", "Passenger", "Observed"].map((role) => (
          <div key={role} className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              value={role}
              checked={filters.roles.includes(role)}
              onChange={() =>
                setFilters((prevFilters) => ({
                  ...prevFilters,
                  roles: prevFilters.roles.includes(role)
                    ? prevFilters.roles.filter((r) => r !== role)
                    : [...prevFilters.roles, role],
                }))
              }
              className="mr-2"
            />
            <span className="text-gray-300">{role}</span>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="text-xl text-gray-200 font-bold mr-4">Sort By:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as keyof Car)}
          className="p-2 bg-gray-800 text-gray-200 rounded"
        >
          <option value="">None</option>
          <option value="year">Year</option>
          <option value="topSpeed">Top Speed</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <h2 className="text-3xl font-semibold mb-6 tracking-wide">Cars</h2>
      <div className="grid grid-cols-1 gap-6">
        {sortedAndFilteredCars.map((car, index) => (
          <div
            key={index}
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
              <p className="text-gray-300">Roles: {car.roles?.length > 0 ? car.roles.join(", ") : "None"}</p>
              <button
                onClick={() => deleteCar(car.id!)}
                className="mt-4 bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
