
import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { Plus, Menu, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);

const { user, setUser, navigate } = useAppContext();

const logout = () => {
  setUser(null);
  localStorage.removeItem("user");
  setOpen(false);
  navigate("/");
};

  return (
   <nav className="relative z-50 flex justify-between items-center mb-5 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-4 border-b border-gray-200 bg-white text-gray-900 text-sm">
      {/* ================= LOGO ================= */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="w-44 cursor-pointer" src={assets.logo} alt="Logo" />
      </NavLink>

      {/* ================= DESKTOP LINKS ================= */}
      <div className="hidden md:flex gap-4 lg:gap-8 items-center">
        <NavLink to="/" className="text-lg font-bold">
          Home
        </NavLink>

        <NavLink to="/browseitem" className="text-lg font-bold">
          Browse Items
        </NavLink>

        {user && (
           <NavLink to="/message" className="text-lg font-bold">
         Message
        </NavLink>
        )}

        <NavLink to="/about" className="text-lg font-bold">
          About Us
        </NavLink>

        <NavLink to="/contact" className="text-lg font-bold">
          Contact
        </NavLink>
      </div>

      {/* ================= DESKTOP BUTTONS ================= */}
      <div className="hidden md:flex items-center gap-3">
        {/* Report Item */}
        {user && (
          <NavLink
            to="/report"
            className="flex items-center gap-1 bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            <Plus size={16} />
            Report Item
          </NavLink>
        )}

        {/* Profile / Login */}
        {user ? (
          <div className="relative group">
            <img
              src={assets.Profile_icon}
              alt="Profile"
              className="w-10 h-10 cursor-pointer"
            />

            {/* Dropdown */}
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white border shadow rounded-md w-36 z-50">
              <li
                onClick={() => navigate("/my-report")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                My Report
              </li>

              <li
                onClick={logout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="border border-green-300 px-5 py-2 text-green-500 hover:bg-emerald-600 hover:text-white rounded-lg transition"
          >
            Login
          </button>
        )}
      </div>

      {/* ================= MOBILE BUTTON ================= */}
      <div className="flex md:hidden items-center">
        <button onClick={() => setOpen(!open)} className="text-gray-700">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg flex flex-col px-6 py-5 gap-4 md:hidden">
          {/* Links */}

          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="font-medium"
          >
            Home
          </NavLink>

          <NavLink
            to="/browseitem"
            onClick={() => setOpen(false)}
            className="font-medium"
          >
            Browse Items
          </NavLink>

          {user && (
             <NavLink
            to="/message"
            onClick={() => setOpen(false)}
            className="font-medium"
          >
          Message
          </NavLink>

          )}
          <NavLink
            to="/about"
            onClick={() => setOpen(false)}
            className="font-medium"
          >
            About Us
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className="font-medium"
          >
            Contact
          </NavLink>

          {/* Report Item */}

       {user && (
            <NavLink
            to="/report"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 bg-green-900 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={16} />
            Report Item
          </NavLink>
       )

       }

          {/* User Options */}

          {user ? (
            <>
              <NavLink
                to="/my-report"
                onClick={() => setOpen(false)}
                className="font-medium"
              >
                My Report
              </NavLink>

              <button
                onClick={logout}
                className="bg-green-900 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/login");
              }}
              className="bg-green-900 text-white px-4 py-2 rounded-lg"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
