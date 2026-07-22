import Student from "../models/Student.js";


export const protect = async (req, res, next) => {
  try {

    let token;


    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }


    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // Find logged-in student
    req.user = await Student.findById(decoded.id)
      .select("-password");


    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    next();


  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  }
};
