// import express from "express";

// import authUser from "../middleware/authUser.js";
// import upload from "../middleware/upload.js";

// import   {createItem, deleteItem, getAllItems, getItemById, getMyItems, markItemSolved, updateItem } from "../controller/itemController.js";

// const ItemRoute = express.Router();


// //1. CREATE ITEM=>  /api/item/create
// ItemRoute.post(
//   "/create",
//   authUser,
//   upload.single("image"),
//   createItem
// );

// //GET ALL ITEM =>  /api/item/all
// ItemRoute.get("/all",getAllItems)

// // GET ITEM BY ID =>  /api/item/:id
// ItemRoute.get("/:id",getItemById);

// //GET MYREPORT =>  /api/item/my-items
// ItemRoute.get("/my-items", authUser, getMyItems);

// //Update item => /api/item/update
//  ItemRoute.put("/:id",authUser,upload.single("image"), updateItem);

//  //Delete item =>
//     ItemRoute.delete("/delete/:id", authUser, deleteItem);

//  ItemRoute.put(
//   "/solve/:id",
//   authUser,
//   markItemSolved
// );


 

// export default ItemRoute;









import express from "express";

import authUser from "../middleware/authUser.js";
import upload from "../middleware/upload.js";

import {
  createItem,
  getAllItems,
  getItemById,
  getMyItems,
  updateItem,
  deleteItem,
  markItemSolved,
} from "../controller/itemController.js";

const ItemRoute = express.Router();


// ==========================================
// CREATE ITEM
// ==========================================

ItemRoute.post(
  "/create",
  authUser,
  upload.single("image"),
  createItem
);


// ==========================================
// GET ALL ITEMS
// ==========================================

ItemRoute.get(
  "/all",
  getAllItems
);


// ==========================================
// GET MY ITEMS
// IMPORTANT: BEFORE /:id
// ==========================================

ItemRoute.get(
  "/my-items",
  authUser,
  getMyItems
);


// ==========================================
// GET SINGLE ITEM
// ==========================================

ItemRoute.get(
  "/:id",
  getItemById
);


// ==========================================
// UPDATE ITEM
// ==========================================

ItemRoute.put(
  "/:id",
  authUser,
  upload.single("image"),
  updateItem
);


// ==========================================
// DELETE ITEM
// ==========================================

ItemRoute.delete(
  "/delete/:id",
  authUser,
  deleteItem
);


// ==========================================
// MARK ITEM AS SOLVED
// ==========================================

ItemRoute.put(
  "/solve/:id",
  authUser,
  markItemSolved
);


export default ItemRoute;