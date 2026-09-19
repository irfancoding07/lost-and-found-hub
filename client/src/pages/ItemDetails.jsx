 

import React, { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { toast } from "react-hot-toast";

import axios from "axios";

import {
  ArrowLeft,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";

import { useAppContext } from "../context/AppContext";

const ItemDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    user,
    backendUrl,
  } = useAppContext();

  const [item, setItem] = useState(null);

  const [showContact, setShowContact] =
    useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);

  // ================= GET ITEM =================

  const getItem = async () => {

    try {

      const { data } = await axios.get(
        `${backendUrl}/api/item/${id}`
      );

      if (data.success) {

        setItem(data.item);

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      console.log("Get Item Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch item"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    getItem();

  }, [id]);

  // ================= LOADING =================

  if (loading) {

    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold">
          Loading item...
        </h1>
      </div>
    );

  }

  // ================= NOT FOUND =================

  if (!item) {

    return (
      <div className="text-center mt-20">

        <h1 className="text-2xl font-bold">
          Item not found
        </h1>

        <button
          onClick={() =>
            navigate("/browseitem")
          }
          className="mt-5 bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Browse Items
        </button>

      </div>
    );

  }

  // ================= SEND MESSAGE =================

  const handleSendMessage = async () => {

    if (message.trim() === "") {

      toast.warning("Please write a message");

      return;

    }

    if (!user) {

      toast.error("Please login first");

      navigate("/login");

      return;

    }

    try {

      const token =
        localStorage.getItem("token");

      const { data } = await axios.post(
        `${backendUrl}/api/message/send`,
        {
          receiver: item.owner._id,
          reportId: item._id,
          message: message.trim(),
        },
        {
          headers: {
            token: token,
          },
        }
      );

      if (data.success) {

        setMessage("");

        toast.success(
          "Message sent successfully!"
        );

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      console.log(
        "Send Message Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to send message"
      );

    }

  };

  return (
    <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 xl:mx-24 mt-10 mb-16">

      <button
        onClick={() =>
          navigate("/browseitem")
        }
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black"
      >
        <ArrowLeft size={18} />

        Back to Browse Items
      </button>

      <div className="grid md:grid-cols-2 gap-10">

        {/* ================= IMAGE ================= */}

        <div>

          <img
            src={item.image}
            alt={item.name}
            className="w-full h-[450px] object-cover rounded-xl"
          />

        </div>

        {/* ================= DETAILS ================= */}

        <div>

          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              item.type === "Lost"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {item.type}
          </span>

          <h1 className="text-4xl font-bold mt-5">
            {item.name}
          </h1>

          <div className="flex items-center gap-2 mt-5 text-gray-500">

            <MapPin size={18} />

            <p>{item.city}</p>

          </div>

          <p className="text-gray-500 mt-3">
            {item.time}
          </p>

          <hr className="border-gray-300 my-6" />

          <div>

            <p className="font-bold text-2xl">
              Description
            </p>

            <p className="text-gray-600 mt-3 leading-7">
              {item.description}
            </p>

          </div>

          {/* ================= CONTACT BUTTON ================= */}

          {item.type === "Lost" && (

            <>
              <button
                onClick={() => {

                  if (!user) {

                    toast.error(
                      "Please login first"
                    );

                    navigate("/login");

                    return;

                  }

                  setShowContact(true);

                }}
                className="mt-8 bg-emerald-900 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition"
              >
                I Found This Item
              </button>

              <p className="mt-3 text-sm text-gray-500">
                If you have found this item, click the
                button above to contact the owner.
              </p>
            </>

          )}

          {/* ================= CONTACT OWNER ================= */}

          {showContact && (

            <div className="mt-6 border border-gray-200 rounded-xl p-6 shadow-sm">

              <h2 className="text-xl font-bold mb-5">
                Contact Owner
              </h2>

              {/* NAME */}

              <div className="flex items-center gap-3 mb-4">

                <User
                  size={18}
                  className="text-gray-500"
                />

                <div>

                  <p className="text-xs text-gray-400">
                    Name
                  </p>

                  <p className="font-medium">
                    {item.owner?.name}
                  </p>

                </div>

              </div>

              {/* EMAIL */}

              <div className="flex items-center gap-3 mb-4">

                <Mail
                  size={18}
                  className="text-gray-500"
                />

                <div>

                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="font-medium">
                    {item.owner?.email}
                  </p>

                </div>

              </div>

              {/* PHONE */}

              <div className="flex items-center gap-3 mb-5">

                <Phone
                  size={18}
                  className="text-gray-500"
                />

                <div>

                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="font-medium">
                    {item.owner?.phone}
                  </p>

                </div>

              </div>

              <label className="block text-sm font-medium mb-2">
                Your Message
              </label>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Write your message..."
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-green-600"
              />

              <button
                onClick={handleSendMessage}
                className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Send Message
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default ItemDetails;