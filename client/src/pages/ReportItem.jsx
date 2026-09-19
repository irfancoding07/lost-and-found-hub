 


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const ReportItem = () => {
  const navigate = useNavigate();

  const {
    user,
    backendUrl,
    addItem,
  } = useAppContext();

  // ================= FORM STATES =================

  const [itemName, setItemName] = useState("");
  const [type, setType] = useState("Lost");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= IMAGE CHANGE =================

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImage(selectedImage);

    const previewURL =
      URL.createObjectURL(selectedImage);

    setImagePreview(previewURL);
  };

  // ================= REMOVE IMAGE =================

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");

    const input =
      document.getElementById("imageInput");

    if (input) {
      input.value = "";
    }
  };

  // ================= RESET FORM =================

  const resetForm = () => {
    setItemName("");
    setType("Lost");
    setLocation("");
    setDate("");
    setDescription("");
    setImage(null);
    setImagePreview("");

    const input =
      document.getElementById("imageInput");

    if (input) {
      input.value = "";
    }
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (
      !itemName.trim() ||
      !type ||
      !location.trim() ||
      !date ||
      !description.trim()
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "name",
        itemName.trim()
      );

      formData.append("type", type);

      formData.append(
        "city",
        location.trim()
      );

      formData.append(
        "time",
        date
      );

      formData.append(
        "description",
        description.trim()
      );

      formData.append(
        "image",
        image
      );

      const { data } =
        await axios.post(
          `${backendUrl}/api/item/create`,
          formData,
          {
            headers: {
              token: token,
            },
          }
        );

      if (!data.success) {
        toast.error(
          data.message ||
            "Failed to report item"
        );
        return;
      }

      // IMPORTANT:
      // Add item immediately to global state
      addItem(data.item);

      toast.success(
        "Item reported successfully!"
      );

      resetForm();

      // No page refresh required
      navigate("/my-report");

    } catch (error) {
      console.error(
        "Create Item Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 xl:mx-24 mt-10 mb-10"
    >
      <div className="border border-gray-200 rounded-xl px-6 sm:px-10 py-8 shadow-sm">

        {/* HEADER */}

        <div>
          <h1 className="font-bold text-3xl text-gray-900">
            Report an Item
          </h1>

          <p className="text-gray-500 mt-2">
            Help us reunite lost items with their owners.
          </p>
        </div>

        {/* ITEM DETAILS */}

        <div className="mt-10">

          <h2 className="font-bold text-2xl mb-8">
            Item Details
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">

            {/* ITEM NAME */}

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Item Name
              </label>

              <input
                type="text"
                value={itemName}
                onChange={(e) =>
                  setItemName(e.target.value)
                }
                placeholder="e.g. iPhone 14, Wallet, Keys..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-green-500"
              />
            </div>

            {/* TYPE */}

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Item Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-green-500"
              >
                <option value="Lost">
                  Lost
                </option>

                <option value="Found">
                  Found
                </option>
              </select>
            </div>

            {/* LOCATION */}

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="e.g. Central Library"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-green-500"
              />
            </div>

            {/* DATE */}

            <div>
              <label className="block font-semibold text-gray-800 mb-2">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-green-500"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="lg:col-span-2">

              <label className="block font-semibold text-gray-800 mb-2">
                Description
              </label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe the item..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-green-500"
              />

            </div>

            {/* IMAGE */}

            <div className="lg:col-span-2">

              <label className="block font-semibold text-gray-800 mb-2">
                Upload Image
              </label>

              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />

              {imagePreview && (
                <div className="mt-4">

                  <p className="text-sm font-medium mb-2">
                    Image Preview
                  </p>

                  <div className="relative w-48">

                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded-lg border"
                    />

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full"
                    >
                      ×
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* OWNER INFORMATION */}

          <hr className="my-10 border-gray-300" />

          <h2 className="font-bold text-2xl mb-6">
            Owner Contact
          </h2>

          <div className="bg-gray-50 border rounded-lg p-5">

            <p>
              <strong>Name:</strong>{" "}
              {user?.name || "N/A"}
            </p>

            <p className="mt-2">
              <strong>Email:</strong>{" "}
              {user?.email || "N/A"}
            </p>

            <p className="mt-2">
              <strong>Phone:</strong>{" "}
              {user?.phone || "N/A"}
            </p>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className={`mt-10 px-10 py-3 rounded-lg font-semibold text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-900 hover:bg-emerald-700"
            }`}
          >
            {loading
              ? "Submitting..."
              : "Submit Report"}
          </button>

        </div>
      </div>
    </form>
  );
};

export default ReportItem;