// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     //Person who sen the message
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     //Person who recive the message
//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     //Which lost and found report this report belongs to
//     reportId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Item",
//       required: true,
//     },

//     //message text
//     message: { type: String, required: true, trim: true },
//   },
//   { timestamps: true },
// );

// const Message = mongoose.model("Message", messageSchema);

// export default Message;


import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Person who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Person who receives the message
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Which lost/found report this message belongs to
    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    // Message text
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;