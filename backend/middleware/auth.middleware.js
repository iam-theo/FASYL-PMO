import jwt from "jsonwebtoken";

export const authMiddleWare = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided or invalid format",
      });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    req.user = decoded; // contains userId + role
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized: invalid or expired token",
    });
  }
};