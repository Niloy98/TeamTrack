import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.id = decode.userId;
    req.role = decode.role;
    next();
  } catch (error) {
    console.log(error);
  }
};

const adminOnly = async (req, res, next) => {
  try {
    if (req.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access Denied, admin only!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export { isAuthenticated, adminOnly };
