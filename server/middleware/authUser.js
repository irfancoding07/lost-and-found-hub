 
// import jwt from "jsonwebtoken";

// const authUser = async (req, res, next) => {
//   try {
//     const { token } = req.headers;

//     if (!token) {
//       return res.json({
//         success: false,
//         message: "Not Authorized. Login again.",
//       });
//     }

//     const tokenDecode = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     req.userId = tokenDecode.id;

//     console.log("Authenticated User ID:", req.userId);

//     next();
//   } catch (error) {
//     console.log("Auth Error:", error.message);

//     return res.json({
//       success: false,
//       message: "Not Authorized. Login again.",
//     });
//   }
// };

// export default authUser;









import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    // Get token from request headers
    const { token } = req.headers;

    // Check token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login again.",
      });
    }

    // Verify token
    const tokenDecode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store logged-in user's ID
    req.userId = tokenDecode.id;

    console.log("Authenticated User ID:", req.userId);

    // Continue to controller
    next();

  } catch (error) {
    console.log("Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not Authorized. Login again.",
    });
  }
};

export default authUser;