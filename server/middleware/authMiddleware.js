const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "There is no token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "The token is invalid" });
  }
};

module.exports = { verifyToken };
