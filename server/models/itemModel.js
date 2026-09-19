// import mongoose, { Schema } from "mongoose";

// const ItemSchema = new mongoose.Schema(
//   {
//     //Item name
//     name: { type: String, required: true, trim: true },
//     //Item type
//     type: { type: String, enum: ["Lost", "Found"], required: true },

//     image: {   type: String, required: true,},
//     imagePublicId: {  type: String,},

//     city: { type: String, required: true, trim: true },
    
//     time: { type: String, required: true },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // REPORT OWNER
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // SOLVED STATUS
//     solved: { type: Boolean, default: false },
//   },
//   {
//     timestamps: true,
//   },
// );

// const Item = mongoose.model("Item", ItemSchema);

// export default Item;



import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    // Item name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Item type
    type: {
      type: String,
      enum: ["Lost", "Found"],
      required: true,
    },

    // Item image
    image: {
      type: String,
      required: true,
    },

    // Cloudinary public ID
    imagePublicId: {
      type: String,
    },

    // City/location
    city: {
      type: String,
      required: true,
      trim: true,
    },

    // Date/time
    time: {
      type: String,
      required: true,
    },

    // Item description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Report owner
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Solved status
    solved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", ItemSchema);

export default Item;