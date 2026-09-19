import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ShoppingBag,
  MousePointer2,
} from "lucide-react";
import { assets } from "../assets/assets";
import { items } from "../data/item";

const MainBanner = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();

  // ================= SEARCH ITEM =================
  const handleSearch = () => {
    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();

    // Check if search is empty
    if (!searchText && !locationText) {
      alert("Please enter an item name or location");
      return;
    }

    // Find matching item
    const foundItem = items.find((item) => {
      const itemName = item.name?.toLowerCase() || "";
      const itemCity = item.city?.toLowerCase() || "";
      const itemDescription =
        item.description?.toLowerCase() || "";

      const nameMatch =
        !searchText ||
        itemName.includes(searchText) ||
        itemDescription.includes(searchText);

      const locationMatch =
        !locationText ||
        itemCity.includes(locationText);

      return nameMatch && locationMatch;
    });

    // If item found
    if (foundItem) {
      navigate(`/item/${foundItem.id}`);
    } else {
      alert("Item not found");
    }
  };

  // Press Enter to search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 xl:mx-24">

      {/* ================= MAIN BANNER ================= */}
      <div className="flex flex-col lg:flex-row items-center justify-between rounded-2xl bg-[#f5fbf7] px-6 sm:px-10 lg:px-14 py-10 overflow-hidden">

        {/* ================= LEFT SIDE ================= */}
        <div className="w-full lg:w-1/2">

          <p className="text-green-600 font-medium mb-4">
            Reuniting lost items with their owners
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Lost Something?
            <br />
            We Can{" "}
            <span className="text-green-600">
              Help.
            </span>
          </h1>

          <p className="text-gray-500 mt-5 max-w-lg leading-7">
            Lost & Found Hub helps you report lost items or
            find items that others have found.
          </p>

          {/* ================= BUTTONS ================= */}
          <div className="flex flex-wrap gap-4 mt-7">

            {/* Report Lost Item */}
            <Link
              to="/report"
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition"
            >
              <MousePointer2 size={18} />
              Report Lost Item
            </Link>

            {/* Report Found Item */}
            <Link
              to="/report"
              className="flex items-center gap-2 border border-green-600 text-green-600 px-5 py-3 rounded-lg hover:bg-green-50 transition"
            >
              <ShoppingBag size={18} />
              Report Found Item
            </Link>

          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0">

          <img
            src={assets.mainBanner}
            alt="Lost and found items"
            className="w-full max-w-xl object-contain"
          />

        </div>
      </div>

      {/* ================= SEARCH SECTION ================= */}
      <div className="bg-white shadow-md rounded-xl p-3 mt-[-25px] relative z-10 mx-2 sm:mx-8">

        <div className="flex flex-col md:flex-row gap-3">

          {/* ================= SEARCH INPUT ================= */}
          <div className="flex items-center gap-3 border rounded-lg px-4 py-3 flex-1">

            <Search
              size={19}
              className="text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Search for lost or found items..."
              className="outline-none w-full text-sm"
            />

          </div>

          {/* ================= LOCATION ================= */}
          <div className="flex items-center gap-3 border rounded-lg px-4 py-3 md:w-52">

            <MapPin
              size={19}
              className="text-gray-400"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Enter location"
              className="outline-none w-full text-sm"
            />

          </div>

          {/* ================= SEARCH BUTTON ================= */}
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Search
          </button>

        </div>
      </div>
    </div>
  );
};

export default MainBanner;