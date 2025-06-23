const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const permissionService = require('../services/permissionService');

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

const checkPermission = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const url = req.originalUrl;

    const permittedUrls = await permissionService.getUserPermissions(userId);
    const isPermitted = permittedUrls.some(p => {
      return url.startsWith(p.url) && (p.method === req.method || p.method === 'ALL');
    });

    if (isPermitted) {
      return next();
    } else {
      return res.status(403).send('Access denied');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { verifyToken, checkPermission };