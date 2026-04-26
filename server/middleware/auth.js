const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 CHECK USER STILL EXISTS
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // attach REAL DB user
    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🔐 Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

// 🔐 Ownership check (flexible field name)
exports.isOwner = (model, field = "user_id") => {
  return async (req, res, next) => {
    try {
      const item = await model.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ message: "Resource not found" });
      }

      // 🔥 IMPORTANT: Sequelize fields are direct properties
      if (item[field] !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }

      req.resource = item;
      next();
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  };
};
