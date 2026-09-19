// import User from "../models/usermodel.js";
// import validator from "validator";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // ==========================================
// // API TO REGISTER USER
// // ==========================================

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, phone } = req.body;

//     // Check missing details
//     if (!name || !email || !password || !phone) {
//       return res.json({
//         success: false,
//         message: "Missing Details",
//       });
//     }

//     // Check email
//     if (!validator.isEmail(email)) {
//       return res.json({
//         success: false,
//         message: "Enter a valid email",
//       });
//     }

//     // Validate password
//     if (password.length < 8) {
//       return res.json({
//         success: false,
//         message: "Password must be at least 8 characters",
//       });
//     }

//     // Validate Indian phone number
//     if (!/^[6-9]\d{9}$/.test(phone)) {
//       return res.json({
//         success: false,
//         message: "Enter a valid Indian phone number",
//       });
//     }

//     // Normalize email
//     const normalizedEmail = email.trim().toLowerCase();

//     // Check existing user
//     const existingUser = await User.findOne({
//       email: normalizedEmail,
//     });

//     if (existingUser) {
//       return res.json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);

//     const hashedPassword = await bcrypt.hash(
//       password,
//       salt
//     );

//     // Create user
//     const user = await User.create({
//       name: name.trim(),
//       email: normalizedEmail,
//       phone: phone.trim(),
//       password: hashedPassword,
//     });

//     // Create JWT token
//     const token = jwt.sign(
//       {
//         id: user._id,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     return res.json({
//       success: true,
//       message: "User registered successfully",
//       token,
//     });

//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };
 
// // API TO LOGIN USER
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check missing details
//     if (!email || !password) {
//       return res.json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     // Normalize email
//     const normalizedEmail = email.trim().toLowerCase();

//     // Find user
//     const user = await User.findOne({
//       email: normalizedEmail,
//     });

//     // User doesn't exist
//     if (!user) {
//       return res.json({
//         success: false,
//         message: "User does not exist",
//       });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(
//       password,
//       user.password
//     );

//     // Wrong password
//     if (!isMatch) {
//       return res.json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // Create JWT token
//     const token = jwt.sign(
//       {
//         id: user._id,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     // Login successful
//     return res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//       },
//     });

//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


// // API TO GET CURRENT USER

// const getUserProfile = async (req, res) => {
//   try {

//     // req.userId comes from authUser middleware
//     const user = await User.findById(req.userId).select("-password");

//     if (!user) {
//       return res.json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.json({
//       success: true,
//       user,
//     });

//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };
 
// // EXPORT
// export {
//   registerUser,
//   loginUser,
//   getUserProfile,
// };



















import User from "../models/usermodel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==========================================
// API TO REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    // Check missing details
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing Details",
      });
    }

    // Check email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Validate Indian phone number
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid Indian phone number",
      });
    }

    // Normalize email
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
    });

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// API TO LOGIN USER
// ==========================================

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Check missing details
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Normalize email
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    // User doesn't exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Wrong password
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Login successful
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// API TO GET CURRENT USER
// ==========================================

const getUserProfile = async (req, res) => {
  try {

    // req.userId comes from authUser middleware
    const user = await User.findById(
      req.userId
    ).select("-password");

    // User not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send user
    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
 

export {
  registerUser,
  loginUser,
  getUserProfile,
};