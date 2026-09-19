import Message from "../models/messageModel.js";
import User from "../models/usermodel.js";
import Item from "../models/itemModel.js";
//Api to send message

const sendMessage = async (req, res) => {
  try {
    const { receiver, reportId, message } = req.body;

    if (!receiver || !reportId || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Missing message details" });
    }

    // Check message is not empty
    if (!message.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Message cannot be empty" });
    }

    // Check receiver exists
    const reciverUser = await User.findById(receiver);
   if (!reciverUser) {
  return res.status(404).json({
    success: false,
    message: "Receiver not found",
  });
}

    // Check report exists
    const item = await Item.findById(reportId);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    //create new message
    const newMessage = await Message.create({
      sender: req.userId,
      receiver,
      reportId,
      message: message.trim(),
    });
    // Get complete message information
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email phone")
      .populate("receiver", "name email phone")
      .populate("reportId", "name type image city time solved");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//Api to get my message
const getMyMessages = async (req, res) => {
  try {
    // Find messages where
    // logged-in user is sender OR receiver
    const messages = await Message.find({
      $or: [
        {
          sender: req.userId,
        },
        {
          receiver: req.userId,
        },
      ],
    })
      .populate("sender", "name email phone")
      .populate("receiver", "name email phone")
      .populate("reportId", "name type image city time solved")
      .sort({
        createdAt: 1,
      });
    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.error("Get My Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//Api to get one conversation
const getConversation = async (req, res) => {
  try {
    const { reportId, userId } = req.params;

    // Find messages between
    // logged-in user and selected user
    // for the selected report

    const messages = await Message.find({
      reportId,

      $or: [
        {
          sender: req.userId,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.userId,
        },
      ],
    })
      .populate("sender", "name email phone")
      .populate("receiver", "name email phone")
      .populate("reportId", "name type image city time solved")
      .sort({
        createdAt: 1,
      });

    return res.status(200).json({
      success: true,
      message: "Conversation fetched successfully",
      messages,
    });
  } catch (error) {
    console.error("Get Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { sendMessage, getMyMessages, getConversation };
