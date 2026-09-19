 



import { Bookmark, MapPin } from "lucide-react";

import { useState } from "react";

import { Link } from "react-router-dom";

import { useAppContext } from "../context/AppContext";

const BrowseItem = () => {
  const { items } = useAppContext();

  const [filter, setFilter] = useState("All");

  const filterItem =
    filter === "All"
      ? items
      : items.filter(
          (item) => item.type === filter
        );

  return (
    <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 xl:mx-24 mt-10">

      <div>

        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Browse Lost & Found Items
          </h1>

          <p className="text-gray-500 mt-2">
            Find lost items or help reunite found belongings with their owners.
          </p>
        </div>

        {/* ---------- Buttons------------- */}

        <div className="mt-10 flex items-center gap-4">

          <button
            onClick={() => setFilter("All")}
            className={`px-5 py-2 rounded-lg border ${
              filter === "All"
                ? "bg-green-600 text-white"
                : "bg-white text-black"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("Lost")}
            className={`px-5 py-2 rounded-lg border ${
              filter === "Lost"
                ? "bg-green-600 text-white"
                : "bg-white text-black"
            }`}
          >
            Lost
          </button>

          <button
            onClick={() => setFilter("Found")}
            className={`border rounded-lg px-5 py-2 ${
              filter === "Found"
                ? "bg-green-600 text-white"
                : "bg-white text-black"
            }`}
          >
            Found
          </button>

        </div>

        <div className="mt-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

            {filterItem.map((item) => (

              <div
                key={item._id}
                className="bg-white mt-4 border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500"
              >

                <div className="relative">

                  <Link to={`/item/${item._id}`}>

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />

                  </Link>

                  <span
                    className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === "Lost"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {item.type}
                  </span>

                  <div className="p-3">

                    <div className="flex items-center justify-between">

                      <h3>{item.name}</h3>

                      <Bookmark
                        size={16}
                        className="text-gray-400 cursor-pointer"
                      />

                    </div>

                    <div className="flex items-center mt-2 gap-1">

                      <MapPin
                        size={13}
                        className="text-gray-400"
                      />

                      <p className="text-xs text-gray-400 truncate">
                        {item.city}
                      </p>

                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      {item.time}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default BrowseItem;