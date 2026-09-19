import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import UserRoute from "./router/userRouter.js";
import ItemRoute from "./router/itemRoute.js";

import connectDB from "./config/mongodb.js";
import { connectCloudinary } from "./config/cloudinary.js";
import MessageRoute from "./router/messageRoute.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Connect Cloudinary
connectCloudinary();

// // Routes
// app.use("/api/user", UserRoute);
// app.use("/api/item", ItemRoute);
// app.use(  "/api/message",MessageRoute)
// // Test route
// app.get("/", (req, res) => {
//   res.send("Lost & Found Hub API is running");
// });

// // Start server
// app.listen(4000, () => {
//   console.log("Server is Running on port 4000");
// });

// Routes
app.use("/api/user", UserRoute);
app.use("/api/item", ItemRoute);
app.use("/api/message", MessageRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Lost & Found Hub API is running");
});

app.get("/test", (req, res) => {
  res.send("TEST WORKING");
});

// Start server
app.listen(4000, () => {
  console.log("Server is Running on port 4000");
});