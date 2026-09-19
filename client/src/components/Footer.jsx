import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="px-6 pt-12 md:px-16 lg:px-36 w-full text-gray-700">

      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-300 pb-10">

        {/* -------- Logo & Description -------- */}
        <div className="md:max-w-96">

          <img
            alt="Lost & Found Hub"
            className="h-12 w-auto"
            src={assets.logo}
          />

          <p className="mt-6 text-sm leading-6 text-gray-500">
            Lost & Found Hub helps people report lost items,
            discover found belongings, and reunite items with
            their rightful owners.
          </p>

        </div>

        {/* -------- Links -------- */}
        <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-10 md:gap-32">

          {/* Company */}
          <div>

            <h2 className="font-semibold mb-5 text-gray-900">
              Company
            </h2>

            <ul className="text-sm space-y-3">

              <li>
                <Link
                  to="/"
                  className="hover:text-green-600 transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/browse"
                  className="hover:text-green-600 transition"
                >
                  Browse Items
                </Link>
              </li>

              <li>
                <Link
                  to="/report"
                  className="hover:text-green-600 transition"
                >
                  Report Item
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="hover:text-green-600 transition"
                >
                  Login
                </Link>
              </li>

            </ul>

          </div>

          {/* Get In Touch */}
          <div>

            <h2 className="font-semibold mb-5 text-gray-900">
              Get in touch
            </h2>

            <div className="text-sm space-y-3 text-gray-500">

              <p>+91 98765 43210</p>

              <p>support@lostfoundhub.com</p>

            </div>

          </div>

        </div>

      </div>

      {/* -------- Copyright -------- */}
      <p className="pt-4 text-center text-sm pb-5 text-gray-500">

        Copyright {new Date().getFullYear()} ©
        <span className="text-green-600 font-medium">
          {' '}Lost & Found Hub
        </span>.
        All Rights Reserved.

      </p>

    </footer>
  )
}

export default Footer