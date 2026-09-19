import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controller/userController.js";

import authUser from "../middleware/authUser.js";

const UserRoute = express.Router();

// Register
UserRoute.post("/register", registerUser);

// Login
UserRoute.post("/login", loginUser);

// Get current user
UserRoute.get("/profile", authUser, getUserProfile);

export default UserRoute;