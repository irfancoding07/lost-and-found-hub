 
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const navigate = useNavigate();

  // ================= BACKEND URL =================

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ================= USER =================

  const savedUser = localStorage.getItem("user");

  const [user, setUser] = useState(
    savedUser ? JSON.parse(savedUser) : null
  );

  const [showUserLogin, setShowUserLogin] =
    useState(false);

  // ================= ITEMS =================

  const [items, setItems] = useState([]);

  // ================= ADD ITEM =================

  const addItem = (newItem) => {
    setItems((prevItems) => [
      newItem,
      ...prevItems,
    ]);
  };

  // ================= GET ALL ITEMS =================

  const getAllItems = async () => {
    try {

      const { data } = await axios.get(
        `${backendUrl}/api/item/all`
      );

      if (data.success) {

        setItems(data.items || []);

      } else {

        toast.error(
          data.message || "Failed to fetch items"
        );
      }

    } catch (error) {

      console.log(
        "Get All Items Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch items"
      );
    }
  };

  // ================= GET SINGLE ITEM =================

  const getItemById = async (id) => {

    try {

      const { data } = await axios.get(
        `${backendUrl}/api/item/${id}`
      );

      if (data.success) {
        return data.item;
      }

      toast.error(
        data.message || "Item not found"
      );

      return null;

    } catch (error) {

      console.log(
        "Get Item Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch item"
      );

      return null;
    }
  };

  // ================= GET MY ITEMS =================

  const getMyItems = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        toast.error("Please login first");

        navigate("/login");

        return [];
      }

      const { data } = await axios.get(
        `${backendUrl}/api/item/my-items`,
        {
          headers: {
            token: token,
          },
        }
      );

      if (data.success) {

        return data.items || [];

      }

      toast.error(
        data.message || "Failed to fetch reports"
      );

      return [];

    } catch (error) {

      console.log(
        "Get My Items Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch your reports"
      );

      return [];
    }
  };

  // ================= DELETE ITEM FROM STATE =================

  const removeItem = (id) => {

    setItems((prevItems) =>
      prevItems.filter(
        (item) => item._id !== id
      )
    );
  };

  // ================= UPDATE ITEM =================

  const updateItem = (updatedItem) => {

    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedItem._id
          ? {
              ...item,
              ...updatedItem,
            }
          : item
      )
    );
  };

  // ================= FETCH ITEMS =================

  useEffect(() => {

    getAllItems();

  }, []);

  // ================= CONTEXT VALUE =================

  const value = {

    // USER
    user,
    setUser,

    // LOGIN
    showUserLogin,
    setShowUserLogin,

    // NAVIGATION
    navigate,

    // ITEMS
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,

    // API FUNCTIONS
    getAllItems,
    getItemById,
    getMyItems,

    // BACKEND
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () =>
  useContext(AppContext);