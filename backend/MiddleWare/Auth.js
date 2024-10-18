const jwt = require("jsonwebtoken");
const ensureAuthenticated = (req, res, next) => {
  const auth = req.header["authorization"];
  if (!auth) {
    return res.status(403).json({ message: "Unauthorized, JWT token require" });
  }
  try {
    const decoded = jet.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT wrong or expired" });
  }
};

module.exports = ensureAuthenticated;
