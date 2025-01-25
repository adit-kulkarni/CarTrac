"use client";
import { useState, useEffect } from "react";
import { Car } from "../page";

interface FilterSortPanelProps {
  filters: {
    year: [number, number];
    topSpeed: [number, number];
    rating: [number, number];
    roles: string[];
  };
  setFilters: (filters: any) => void;
  sortOption: keyof Car | "";
  setSortOption: (option: keyof Car | "") => void;
}

export default function FilterSortPanel({
  filters,
  setFilters,
  sortOption,
  setSortOption,
}: FilterSortPanelProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const filterButton = document.querySelector('.filter-button');
      const sortButton = document.querySelector('.sort-button');
      const filterPanel = document.querySelector('.filter-panel');
      const sortPanel = document.querySelector('.sort-panel');

      if (filterButton?.contains(target) || sortButton?.contains(target)) {
        return;
      }

      if (!filterPanel?.contains(target) && !sortPanel?.contains(target)) {
        setShowFilters(false);
        setShowSort(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative mb-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => {
            setShowFilters(!showFilters);
            setShowSort(false);
          }}
          className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg hover:bg-gray-700 filter-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          Filter
        </button>

        <button
          onClick={() => {
            setShowSort(!showSort);
            setShowFilters(false);
          }}
          className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg hover:bg-gray-700 sort-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="3" x2="12" y2="21" />
            <polyline points="17 8 12 3 7 8" />
            <polyline points="17 16 12 21 7 16" />
          </svg>
          Sort
        </button>
      </div>

      {showFilters && (
        <div className="absolute z-10 bg-gray-800 p-4 rounded-lg shadow-lg w-80 filter-panel">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Year Range:</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1900"
                max="2100"
                value={filters.year[0]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    year: [Number(e.target.value), filters.year[1]],
                  })
                }
                className="w-full"
              />
              <input
                type="range"
                min="1900"
                max="2100"
                value={filters.year[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    year: [filters.year[0], Number(e.target.value)],
                  })
                }
                className="w-full"
              />
            </div>
            <span className="text-sm">
              {filters.year[0]} - {filters.year[1]}
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Speed Range (km/h):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="500"
                value={filters.topSpeed[0]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    topSpeed: [Number(e.target.value), filters.topSpeed[1]],
                  })
                }
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="500"
                value={filters.topSpeed[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    topSpeed: [filters.topSpeed[0], Number(e.target.value)],
                  })
                }
                className="w-full"
              />
            </div>
            <span className="text-sm">
              {filters.topSpeed[0]} - {filters.topSpeed[1]}
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              Rating Range:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={filters.rating[0]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    rating: [Number(e.target.value), filters.rating[1]],
                  })
                }
                className="w-full"
              />
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={filters.rating[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    rating: [filters.rating[0], Number(e.target.value)],
                  })
                }
                className="w-full"
              />
            </div>
            <span className="text-sm">
              {filters.rating[0]} - {filters.rating[1]}
            </span>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Roles:</label>
            {["Driver", "Passenger", "Observed"].map((role) => (
              <div key={role} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={role}
                  checked={filters.roles.includes(role)}
                  onChange={() =>
                    setFilters((prevFilters: any) => ({
                      ...prevFilters,
                      roles: prevFilters.roles.includes(role)
                        ? prevFilters.roles.filter((r: string) => r !== role)
                        : [...prevFilters.roles, role],
                    }))
                  }
                  className="mr-2"
                />
                <span className="text-sm">{role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSort && (
        <div className="absolute z-10 bg-gray-800 p-4 rounded-lg shadow-lg sort-panel">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as keyof Car)}
            className="w-full p-2 bg-gray-700 text-gray-200 rounded"
          >
            <option value="">None</option>
            <option value="year">Year</option>
            <option value="topSpeed">Top Speed</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      )}
    </div>
  );
}