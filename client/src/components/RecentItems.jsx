 


import { Bookmark, MapPin } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useAppContext } from "../context/AppContext";

const RecentItems = () => {
  const navigate = useNavigate();

  const { items } = useAppContext();

  const handleClick = () => {
    navigate("/browseitem");
  };

  return (
    <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 xl:mx-24 mt-10">

      <div className="flex items-center justify-between">

        <h1 className="font-semibold text-xl text-black">
          Recent Lost & Found Items
        </h1>

        <button
          onClick={handleClick}
          className="text-cyan-800"
        >
          View all
        </button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

        {items.slice(0, 5).map((item) => (

          <div
            key={item._id}
            className="bg-white mt-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-500"
          >

            <div className="relative">

              <Link to={`/item/${item._id}`}>

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover cursor-pointer"
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
  );
};

export default RecentItems;