const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  if (
    !JWT_SECRET ||
    typeof JWT_SECRET !== "string" ||
    JWT_SECRET.trim() === ""
  ) {
    return res
      .status(500)
      .json({ message: "JWT secret not configured on server" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
};

module.exports = authenticate;
