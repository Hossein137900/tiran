"use client";
import { useState, useEffect } from "react";
import { getProvincesForDropdown, getCitiesForDropdown } from "@/lib/dataCity";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, ChevronDown, Check, X } from "lucide-react";
import { LocationSelectorProps } from "@/types/type";

export default function LocationSelector({
  onProvinceChange,
  onCityChange,
  onLocationSelected,
  className = "",
}: LocationSelectorProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([]);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [searchProvince, setSearchProvince] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedCityName, setSelectedCityName] = useState("");

  console.log(selectedCityId, selectedProvinceId);

  // Get all provinces for dropdown
  const provinceOptions = getProvincesForDropdown();

  // Filter provinces based on search
  const filteredProvinces = provinceOptions.filter((province) =>
    province.name.includes(searchProvince)
  );

  // Filter cities based on search
  const filteredCities = cities.filter((city) =>
    city.name.includes(searchCity)
  );

  // Handle province selection
  const handleProvinceSelect = (provinceId: string, provinceName: string) => {
    setSelectedProvinceId(provinceId);
    setSelectedProvinceName(provinceName);
    setSelectedCityId(""); // Reset city selection when province changes
    setSelectedCityName("");
    setIsProvinceOpen(false);

    if (provinceId) {
      // Get cities for the selected province
      const citiesForDropdown = getCitiesForDropdown(provinceId);
      setCities(citiesForDropdown);

      // Call the onProvinceChange callback if provided
      if (onProvinceChange) {
        onProvinceChange(provinceId, provinceName);
      }
    } else {
      setCities([]);
    }
  };

  // Handle city selection
  const handleCitySelect = (cityId: string, cityName: string) => {
    setSelectedCityId(cityId);
    setSelectedCityName(cityName);
    setIsCityOpen(false);

    // Call the onCityChange callback if provided
    if (cityId && onCityChange) {
      onCityChange(cityId, cityName);
    }

    // Call the onLocationSelected callback if both province and city are selected
    if (selectedProvinceId && cityId && onLocationSelected) {
      onLocationSelected(
        selectedProvinceId,
        selectedProvinceName,
        cityId,
        cityName
      );
    }
  };

  // Reset selections
  const resetSelections = () => {
    setSelectedProvinceId("");
    setSelectedProvinceName("");
    setSelectedCityId("");
    setSelectedCityName("");
    setCities([]);
    setSearchProvince("");
    setSearchCity("");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".province-dropdown") &&
        !target.closest(".province-select")
      ) {
        setIsProvinceOpen(false);
      }
      if (
        !target.closest(".city-dropdown") &&
        !target.closest(".city-select")
      ) {
        setIsCityOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`} dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          <MapPin className="h-6 w-6 text-purple-600 ml-2" />
          <h2 className="text-xl font-bold text-right">انتخاب موقعیت مکانی</h2>
        </motion.div>

        {(selectedProvinceId || selectedCityId) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetSelections}
            className="flex items-center text-sm text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4 ml-1" />
            پاک کردن
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Province Selector */}
        <div className="relative">
          <label
            htmlFor="province"
            className="flex items-center text-sm font-medium text-gray-700 text-right mb-2"
          >
            <Navigation className="h-4 w-4 ml-1 text-purple-500" />
            استان
          </label>

          <motion.div
            className="relative province-select"
            whileHover={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
          >
            <button
              onClick={() => setIsProvinceOpen(!isProvinceOpen)}
              className="w-full py-3 px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-right flex items-center justify-between"
            >
              <span
                className={
                  selectedProvinceName ? "text-gray-900" : "text-gray-400"
                }
              >
                {selectedProvinceName || "انتخاب استان"}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  isProvinceOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isProvinceOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto province-dropdown"
                >
                  <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                    <input
                      type="text"
                      value={searchProvince}
                      onChange={(e) => setSearchProvince(e.target.value)}
                      placeholder="جستجوی استان..."
                      className="w-full p-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="py-1">
                    {filteredProvinces.length > 0 ? (
                      filteredProvinces.map((province) => (
                        <motion.button
                          key={province.id}
                          whileHover={{ backgroundColor: "#F3F4F6" }}
                          onClick={() =>
                            handleProvinceSelect(province.id, province.name)
                          }
                          className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                        >
                          <span>{province.name}</span>
                          {selectedProvinceId === province.id && (
                            <Check className="h-4 w-4 text-purple-600" />
                          )}
                        </motion.button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500 text-center">
                        استانی یافت نشد
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* City Selector */}
        <div className="relative">
          <label
            htmlFor="city"
            className="flex items-center text-sm font-medium text-gray-700 text-right mb-2"
          >
            <MapPin className="h-4 w-4 ml-1 text-purple-500" />
            شهر
          </label>

          <motion.div
            className="relative city-select"
            whileHover={
              selectedProvinceId
                ? { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }
                : {}
            }
          >
            <button
              onClick={() => selectedProvinceId && setIsCityOpen(!isCityOpen)}
              disabled={!selectedProvinceId}
              className={`w-full py-3 px-4 border rounded-md shadow-sm text-right flex items-center justify-between ${
                !selectedProvinceId
                  ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                  : "bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              }`}
            >
              <span
                className={selectedCityName ? "text-gray-900" : "text-gray-400"}
              >
                {!selectedProvinceId
                  ? "ابتدا استان را انتخاب کنید"
                  : selectedCityName || "انتخاب شهر"}
              </span>
              {selectedProvinceId && (
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    isCityOpen ? "transform rotate-180" : ""
                  }`}
                />
              )}
            </button>

            <AnimatePresence>
              {isCityOpen && selectedProvinceId && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto city-dropdown"
                >
                  <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                    <input
                      type="text"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      placeholder="جستجوی شهر..."
                      className="w-full p-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="py-1">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <motion.button
                          key={city.id}
                          whileHover={{ backgroundColor: "#F3F4F6" }}
                          onClick={() => handleCitySelect(city.id, city.name)}
                          className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                        >
                          <span>{city.name}</span>
                          {selectedCityId === city.id && (
                            <Check className="h-4 w-4 text-purple-600" />
                          )}
                        </motion.button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500 text-center">
                        شهری یافت نشد
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Selected Location Display */}
      <AnimatePresence>
        {selectedProvinceId && selectedCityId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-4 bg-purple-50 rounded-md border border-purple-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-purple-600 ml-2" />
                <h3 className="font-semibold text-purple-800">
                  موقعیت انتخاب شده
                </h3>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetSelections}
                className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
              >
                <X className="h-3 w-3 ml-1" />
                تغییر
              </motion.button>
            </div>

            <div className="mt-2 text-right text-sm text-purple-700">
              <p className="mb-1">
                استان:{" "}
                <span className="font-semibold">{selectedProvinceName}</span>
              </p>
              <p>
                شهر: <span className="font-semibold">{selectedCityName}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// use in another page with props for example /app/page.tsx

//   const [selectedLocation, setSelectedLocation] = useState<{
//     provinceId: string;
//     provinceName: string;
//     cityId: string;
//     cityName: string;
//   } | null>(null);
//   const [showLocationBadge, setShowLocationBadge] = useState(false);

//   const handleLocationSelected = (
//     provinceId: string,
//     provinceName: string,
//     cityId: string,
//     cityName: string
//   ) => {
//     setSelectedLocation({
//       provinceId,
//       provinceName,
//       cityId,
//       cityName,
//     });
//     setShowLocationBadge(true);

//     // You can use this location data for other purposes
//     // For example, filtering products by location, etc.
//     console.log("Selected location:", { provinceId, provinceName, cityId, cityName });
//   };

//    <LocationSelector
//           onLocationSelected={handleLocationSelected}
//           className="mb-8"
//         />
