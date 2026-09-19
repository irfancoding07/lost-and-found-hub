// import Item from "../models/itemModel.js";
// import { cloudinary } from "../config/cloudinary.js";

// // Api to create an item
// const createItem = async (req, res) => {
//   try {
//     const { name, type, city, time, description } = req.body;

//     //Missing details
//     if (!name || !type || !city || !time || !description) {
//       return res.json({ success: false, message: "Missing details" });
//     }

//     //Check item type
//     if (type !== "Lost" && type !== "Found") {
//       return res.json({
//         success: false,
//         message: "Item type must be Lost or Found",
//       });
//     }

//     //Check image
//     if (!req.file) {
//       return res.json({ success: false, message: "Please upload an image" });
//     }

//     //Upload image to cloundinary
//     const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//       folder: "lost-and-found",
//     });

//     //Create item
//     const item = await Item.create({
//       name: name.trim(),
//       type,
//       city: city.trim(),
//       time: time.trim(),
//       description: description.trim(),

//       // Cloudinary image URL
//       image: uploadResult.secure_url,

//       // Cloudinary public ID
//       imagePublicId: uploadResult.public_id,

//       // Logged-in user
//       owner: req.userId,

//       // Default status
//       solved: false,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Item reported successfully",
//       item,
//     });
//   } catch (error) {
//     console.error("Create Item Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // GET ALL ITEMS API
// const getAllItems = async (req, res) => {
//   try {
//     // Get all items from MongoDB
//     const items = await Item.find()
//       .populate("owner", "name email phone") //Populates means => mongo give the data of owner in character not objectid
//       .sort({ createdAt: -1 }); //Decending order (-1)

//     return res.status(200).json({
//       success: true,
//       message: "Items fetched successfully",
//       items,
//     });
//   } catch (error) {
//     console.error("Get All Items Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // GET ITEM BY ID API
// const getItemById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find item by ID
//     const item = await Item.findById(id).populate("owner", "name email phone");

//     // Item not found
//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Item not found",
//       });
//     }

//     // Send item
//     return res.status(200).json({
//       success: true,
//       message: "Item fetched successfully",
//       item,
//     });
//   } catch (error) {
//     console.error("Get Item By ID Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// // GET MY REPORTS API
// const getMyItems = async (req, res) => {
//   try {
//     // Get reports created by logged-in user
//     const items = await Item.find({
//       owner: req.userId,
//     })
//       .populate("owner", "name email phone")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       message: "My reports fetched successfully",
//       items,
//     });
//   } catch (error) {
//     console.error("Get My Items Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// //Api to update item
// const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { name, type, city, time, description } = req.body;

//     //Find id
//     const item = await Item.findById(id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Item not found",
//       });
//     }

//     //Check owner
//     if (item.owner.toString() !== req.userId) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to update this item",
//       });
//     }

//     //Validate item type
//     if (type && type !== "Lost" && type !== "Found") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Item type must be Lost or Found" });
//     }

//     //Update text details
//     if (name) {
//       item.name = name.trim();
//     }
//     if (type) {
//       item.type = type;
//     }

//     if (city) {
//       item.city = city.trim();
//     }

//     if (time) {
//       item.time = time.trim();
//     }

//     if (description) {
//       item.description = description.trim();
//     }

//     //Update image
//     if (req.file) {
//       //Delete old image from cloudniary
//       if (item.imagePublicId) {
//         await cloudinary.uploader.destroy(item.imagePublicId);
//       }

//       //Update new image
//       const uploadResult = await cloudinary.uploader.upload(req.file.path, {
//         folder: "Lost-and-found",
//       });

//       // Save new image
//       item.image = uploadResult.secure_url;

//       item.imagePublicId = uploadResult.public_id;
//     }

//     //SAVE UPDATE ITEM
//     const updatedItem = await item.save();

//     return res.status(200).json({
//       success: true,
//       message: "Item updated successfully",
//       item: updatedItem,
//     });
//   } catch (error) {
//     console.error("Update Item Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };



// //API to delete item
// const deleteItem = async (req,res) => {
//     try {
//         const {id} = req.params

//         //Find item
//         const item = await Item.findById(id)

//         if(!item){
//             return res.status(404).json({success:false,message:"Item not found"})
//         }

//         //Chheck wether this item belongs to login user{
//         if(item.owner.toString() !== req.userId.toString()) {
//             return res.status(403).json({
//         success: false,
//         message: "You are not authorized to delete this item",
//       });
    
//         }


//    // Delete image from Cloudinary
//     if (item.imagePublicId) {
//       await cloudinary.uploader.destroy(item.imagePublicId);
//     }

//     // Delete item from MongoDB
//     await Item.findByIdAndDelete(id);

//     return res.status(200).json({
//       success: true,
//       message: "Item deleted successfully",
//     });

//   } catch (error) {
//     console.error("Delete Item Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };





 
// // API TO MARK ITEM AS SOLVED
// const markItemSolved = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find item
//     const item = await Item.findById(id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Item not found",
//       });
//     }

//     // Check item belongs to logged-in user
//     if (item.owner.toString() !== req.userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to mark this item as solved",
//       });
//     }

//     // Check already solved
//     if (item.solved) {
//       return res.json({
//         success: false,
//         message: "Item is already solved",
//       });
//     }

//     // Update solved status
//     item.solved = true;

//     await item.save();

//     return res.status(200).json({
//       success: true,
//       message: "Item marked as solved successfully",
//       item,
//     });

//   } catch (error) {
//     console.error("Mark Solved Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


// export { createItem, getAllItems, getItemById, getMyItems,updateItem,deleteItem,markItemSolved };















import Item from "../models/itemModel.js";
import { cloudinary } from "../config/cloudinary.js";

// ==========================================
// API TO CREATE ITEM
// ==========================================

const createItem = async (req, res) => {
  try {
    const {
      name,
      type,
      city,
      time,
      description,
    } = req.body;

    // Check missing details
    if (
      !name ||
      !type ||
      !city ||
      !time ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    // Check item type
    if (
      type !== "Lost" &&
      type !== "Found"
    ) {
      return res.status(400).json({
        success: false,
        message: "Item type must be Lost or Found",
      });
    }

    // Check image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    // Upload image to Cloudinary
    const uploadResult =
      await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "lost-and-found",
        }
      );

    // Create item
    const item = await Item.create({
      name: name.trim(),
      type,
      city: city.trim(),
      time: time.trim(),
      description: description.trim(),

      // Cloudinary image URL
      image: uploadResult.secure_url,

      // Cloudinary public ID
      imagePublicId: uploadResult.public_id,

      // Logged-in user
      owner: req.userId,

      // Default status
      solved: false,
    });

    return res.status(201).json({
      success: true,
      message: "Item reported successfully",
      item,
    });

  } catch (error) {
    console.error(
      "Create Item Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET ALL ITEMS
// ==========================================

const getAllItems = async (req, res) => {
  try {

    const items = await Item.find()
      .populate(
        "owner",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Items fetched successfully",
      items,
    });

  } catch (error) {
    console.error(
      "Get All Items Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET ITEM BY ID
// ==========================================

const getItemById = async (req, res) => {
  try {

    const { id } = req.params;

    const item = await Item.findById(id)
      .populate(
        "owner",
        "name email phone"
      );

    // Item not found
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item fetched successfully",
      item,
    });

  } catch (error) {
    console.error(
      "Get Item By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET MY REPORTS
// ==========================================

const getMyItems = async (req, res) => {
  try {

    const items = await Item.find({
      owner: req.userId,
    })
      .populate(
        "owner",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "My reports fetched successfully",
      items,
    });

  } catch (error) {
    console.error(
      "Get My Items Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// UPDATE ITEM
// ==========================================

const updateItem = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      type,
      city,
      time,
      description,
    } = req.body;

    // Find item
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check owner
    if (
      item.owner.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this item",
      });
    }

    // Validate item type
    if (
      type &&
      type !== "Lost" &&
      type !== "Found"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Item type must be Lost or Found",
      });
    }

    // Update text details
    if (name?.trim()) {
      item.name = name.trim();
    }

    if (type) {
      item.type = type;
    }

    if (city?.trim()) {
      item.city = city.trim();
    }

    if (time?.trim()) {
      item.time = time.trim();
    }

    if (description?.trim()) {
      item.description =
        description.trim();
    }

    // Update image
    if (req.file) {

      // Delete old image from Cloudinary
      if (item.imagePublicId) {
        await cloudinary.uploader.destroy(
          item.imagePublicId
        );
      }

      // Upload new image
      const uploadResult =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "lost-and-found",
          }
        );

      // Save new image
      item.image =
        uploadResult.secure_url;

      item.imagePublicId =
        uploadResult.public_id;
    }

    // Save updated item
    const updatedItem =
      await item.save();

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item: updatedItem,
    });

  } catch (error) {
    console.error(
      "Update Item Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// DELETE ITEM
// ==========================================

const deleteItem = async (req, res) => {
  try {

    const { id } = req.params;

    // Find item
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check item belongs to logged-in user
    if (
      item.owner.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this item",
      });
    }

    // Delete image from Cloudinary
    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(
        item.imagePublicId
      );
    }

    // Delete item from MongoDB
    await Item.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Item Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// MARK ITEM AS SOLVED
// ==========================================

const markItemSolved = async (req, res) => {
  try {

    const { id } = req.params;

    // Find item
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check item belongs to logged-in user
    if (
      item.owner.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to mark this item as solved",
      });
    }

    // Check already solved
    if (item.solved) {
      return res.status(400).json({
        success: false,
        message: "Item is already solved",
      });
    }

    // Mark solved
    item.solved = true;

    await item.save();

    return res.status(200).json({
      success: true,
      message:
        "Item marked as solved successfully",
      item,
    });

  } catch (error) {
    console.error(
      "Mark Solved Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// EXPORT
// ==========================================

export {
  createItem,
  getAllItems,
  getItemById,
  getMyItems,
  updateItem,
  deleteItem,
  markItemSolved,
};