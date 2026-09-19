 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const MyReport = () => {
  const navigate = useNavigate();

  const {
    user,
    backendUrl,
    updateItem,
    removeItem,
  } = useAppContext();

  // ==============================
  // REPORT STATES
  // ==============================

  const [appointments, setAppointments] = useState([]);
  const [filteritem, setFilteritem] = useState("All");
  const [loading, setLoading] = useState(false);

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal
  const [editItem, setEditItem] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // ==============================
  // GET MY REPORTS
  // ==============================

  const getMyReports = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/item/my-items`,
        {
          headers: {
            token: token,
          },
        }
      );

      if (data.success) {
        setAppointments(data.items || []);
      } else {
        toast.error(
          data.message || "Failed to fetch reports"
        );
      }
    } catch (error) {
      console.error(
        "Get My Reports Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch your reports"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // FETCH REPORTS
  // ==============================

  useEffect(() => {
    if (user) {
      getMyReports();
    }
  }, [user]);

  // ==============================
  // FILTER ITEMS
  // ==============================

  const filterItems = appointments.filter((item) => {
    if (filteritem === "All") {
      return !item.solved;
    }

    if (filteritem === "Lost") {
      return (
        item.type === "Lost" &&
        !item.solved
      );
    }

    if (filteritem === "Found") {
      return (
        item.type === "Found" &&
        !item.solved
      );
    }

    if (filteritem === "Solved") {
      return item.solved;
    }

    return false;
  });

  // ==============================
  // MARK ITEM AS SOLVED
  // ==============================

  const handleSolved = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/item/solve/${id}`,
        {},
        {
          headers: {
            token: token,
          },
        }
      );

      if (data.success) {
        const solvedItem = appointments.find(
          (item) => item._id === id
        );

        if (solvedItem) {
          const updatedItem = {
            ...solvedItem,
            solved: true,
            ...(data.item || {}),
          };

          // Update MyReport
          setAppointments((prev) =>
            prev.map((item) =>
              item._id === id
                ? updatedItem
                : item
            )
          );

          // Update global context
          updateItem(updatedItem);
        }

        toast.success(
          data.message ||
            "Report marked as solved!"
        );

        // Automatically show solved reports
        setFilteritem("Solved");
      } else {
        toast.error(
          data.message ||
            "Failed to mark as solved"
        );
      }
    } catch (error) {
      console.error(
        "Mark Solved Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to mark report as solved"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE REPORT
  // ==============================

  const handleDelete = async () => {
    if (!deleteId || deleting) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      setDeleteId(null);
      navigate("/login");
      return;
    }

    const idToDelete = deleteId;

    try {
      setDeleting(true);

      const { data } = await axios.delete(
        `${backendUrl}/api/item/delete/${idToDelete}`,
        {
          headers: {
            token: token,
          },
        }
      );

      if (!data.success) {
        toast.error(
          data.message ||
            "Failed to delete report"
        );
        return;
      }

      // =================================
      // 1. Remove from MyReport state
      // =================================

      setAppointments((prev) =>
        prev.filter(
          (item) => item._id !== idToDelete
        )
      );

      // =================================
      // 2. Remove from global context
      // =================================

      removeItem(idToDelete);

      // =================================
      // 3. CLOSE DELETE MODAL
      // =================================

      setDeleteId(null);

      // =================================
      // 4. SHOW ONLY SUCCESS TOAST
      // =================================

      toast.success(
        data.message ||
          "Report deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete Report Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete report"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==============================
  // EDIT CHANGE
  // ==============================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // SAVE EDIT
  // ==============================

  const handleSaveEdit = async () => {
    if (!editItem) {
      return;
    }

    if (
      !editItem.name?.trim() ||
      !editItem.city?.trim() ||
      !editItem.description?.trim()
    ) {
      toast.error(
        "Please fill all required fields"
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      setEditItem(null);
      navigate("/login");
      return;
    }

    try {
      setSavingEdit(true);

      const formData = new FormData();

      formData.append(
        "name",
        editItem.name.trim()
      );

      formData.append(
        "type",
        editItem.type
      );

      formData.append(
        "city",
        editItem.city.trim()
      );

      formData.append(
        "time",
        editItem.time || ""
      );

      formData.append(
        "description",
        editItem.description.trim()
      );

      const { data } = await axios.put(
        `${backendUrl}/api/item/${editItem._id}`,
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
            "Failed to update item"
        );
        return;
      }

      // =================================
      // Updated item from backend
      // =================================

      const updatedItem = {
        ...editItem,
        ...(data.item || {}),
      };

      // =================================
      // Update MyReport
      // =================================

      setAppointments((prev) =>
        prev.map((item) =>
          item._id === editItem._id
            ? updatedItem
            : item
        )
      );

      // =================================
      // Update global context
      // =================================

      updateItem(updatedItem);

      // =================================
      // Close edit modal
      // =================================

      setEditItem(null);

      toast.success(
        data.message ||
          "Item updated successfully!"
      );
    } catch (error) {
      console.error(
        "Update Item Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update report"
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // ==============================
  // NOT LOGGED IN
  // ==============================

  if (!user) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold">
          Please login first
        </h1>
      </div>
    );
  }

  // ==============================
  // UI
  // ==============================

  return (
    <div className="mx-4 sm:mx-6 md:mx-10 lg:mx-16 xl:mx-24 mt-10 mb-10">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        My Reports
      </h1>

      {/* ========================= */}
      {/* FILTER */}
      {/* ========================= */}

      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          "All",
          "Lost",
          "Found",
          "Solved",
        ].map((filter) => (
          <button
            key={filter}
            onClick={() =>
              setFilteritem(filter)
            }
            className={`px-5 py-2 rounded-lg border ${
              filteritem === filter
                ? "bg-emerald-900 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ========================= */}
      {/* LOADING */}
      {/* ========================= */}

      {loading && (
        <p className="text-gray-500 mb-4">
          Loading...
        </p>
      )}

      {/* ========================= */}
      {/* EMPTY */}
      {/* ========================= */}

      {!loading &&
        filterItems.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No reports found.
          </div>
        )}

      {/* ========================= */}
      {/* ITEMS */}
      {/* ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filterItems.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl overflow-hidden shadow-sm bg-white"
          >

            {/* IMAGE */}

            <img
              src={item.image}
              alt={item.name}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">

              {/* NAME + TYPE */}

              <div className="flex justify-between items-center gap-3">

                <h2 className="font-bold text-xl">
                  {item.name}
                </h2>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    item.type === "Lost"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.type}
                </span>

              </div>

              {/* LOCATION */}

              <p className="text-gray-500 mt-2">
                📍 {item.city}
              </p>

              {/* DATE */}

              <p className="text-gray-500">
                📅 {item.time}
              </p>

              {/* DESCRIPTION */}

              <p className="text-gray-600 mt-3">
                {item.description}
              </p>

              {/* OWNER */}

              {item.owner && (
                <div className="mt-4 border-t pt-3">

                  <p className="font-semibold">
                    Owner
                  </p>

                  <p className="text-sm text-gray-600">
                    {item.owner.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {item.owner.email}
                  </p>

                  <p className="text-sm text-gray-600">
                    {item.owner.phone}
                  </p>

                </div>
              )}

              {/* SOLVED BUTTON */}

              {!item.solved && (
                <button
                  onClick={() =>
                    handleSolved(item._id)
                  }
                  disabled={loading}
                  className="w-full mt-5 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  Mark as Solved
                </button>
              )}

              {/* EDIT + DELETE */}

              <div className="flex gap-3 mt-3">

                <button
                  onClick={() =>
                    setEditItem({
                      ...item,
                    })
                  }
                  disabled={deleting}
                  className="flex-1 border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    setDeleteId(item._id)
                  }
                  disabled={deleting}
                  className="flex-1 border border-red-500 text-red-600 py-2 rounded-lg hover:bg-red-50"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        ))}

      </div>

      {/* ================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================================= */}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h2 className="text-xl font-bold">
              Delete Report?
            </h2>

            <p className="text-gray-500 mt-2">
              Are you sure you want to delete
              this report?
            </p>

            <div className="flex gap-3 mt-6">

              {/* CANCEL */}

              <button
                type="button"
                onClick={() => {
                  if (!deleting) {
                    setDeleteId(null);
                  }
                }}
                disabled={deleting}
                className="flex-1 border py-2 rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>

              {/* DELETE */}

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg disabled:bg-gray-400"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* EDIT MODAL */}
      {/* ================================================= */}

      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold mb-5">
              Edit Report
            </h2>

            {/* NAME */}

            <label className="block font-medium mb-1">
              Item Name
            </label>

            <input
              name="name"
              value={editItem.name || ""}
              onChange={handleEditChange}
              placeholder="Item name"
              className="w-full border px-4 py-2 rounded-lg mb-3"
            />

            {/* TYPE */}

            <label className="block font-medium mb-1">
              Item Type
            </label>

            <select
              name="type"
              value={editItem.type || "Lost"}
              onChange={handleEditChange}
              className="w-full border px-4 py-2 rounded-lg mb-3"
            >
              <option value="Lost">
                Lost
              </option>

              <option value="Found">
                Found
              </option>
            </select>

            {/* CITY */}

            <label className="block font-medium mb-1">
              Location
            </label>

            <input
              name="city"
              value={editItem.city || ""}
              onChange={handleEditChange}
              placeholder="Location"
              className="w-full border px-4 py-2 rounded-lg mb-3"
            />

            {/* DATE */}

            <label className="block font-medium mb-1">
              Date
            </label>

            <input
              name="time"
              type="date"
              value={editItem.time || ""}
              onChange={handleEditChange}
              className="w-full border px-4 py-2 rounded-lg mb-3"
            />

            {/* DESCRIPTION */}

            <label className="block font-medium mb-1">
              Description
            </label>

            <textarea
              name="description"
              value={
                editItem.description || ""
              }
              onChange={handleEditChange}
              placeholder="Description"
              rows="4"
              className="w-full border px-4 py-2 rounded-lg mb-3"
            />

            {/* BUTTONS */}

            <div className="flex gap-3 mt-4">

              <button
                type="button"
                onClick={() => {
                  if (!savingEdit) {
                    setEditItem(null);
                  }
                }}
                disabled={savingEdit}
                className="flex-1 border py-2 rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="flex-1 bg-emerald-900 text-white py-2 rounded-lg disabled:bg-gray-400"
              >
                {savingEdit
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default MyReport;