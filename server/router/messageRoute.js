import express from "express";

import authUser from "../middleware/authUser.js";

import {
  sendMessage,
  getMyMessages,
  getConversation,
} from "../controller/messageController.js";

const MessageRoute = express.Router();


// ==========================================
// SEND MESSAGE
// ==========================================

MessageRoute.post(
  "/send",
  authUser,
  sendMessage
);


// ==========================================
// GET MY MESSAGES
// ==========================================

MessageRoute.get(
  "/my-messages",
  authUser,
  getMyMessages
);


// ==========================================
// GET CONVERSATION
// ==========================================

MessageRoute.get(
  "/conversation/:reportId/:userId",
  authUser,
  getConversation
);


export default MessageRoute;