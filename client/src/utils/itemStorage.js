import { items } from "../data/item.js";

const STORAGE_KEY = "lostFoundItems";

// Get items from localStorage
export const getItems = () => {
  const savedItems = localStorage.getItem(STORAGE_KEY);

  if (savedItems) {
    return JSON.parse(savedItems);
  }

  // First time: save original items
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  return items;
};

// Save items to localStorage
export const saveItems = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};