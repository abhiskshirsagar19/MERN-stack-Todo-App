const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers["authorization"];

  // Check if the Authorization header is provided
  if (!auth) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token required" });
  }

  // Extract the token from the "Bearer <token>" format
  const token = auth.split(" ")[1]; // Get the token part

  if (!token) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT wrong or expired" });
  }
};

module.exports = ensureAuthenticated;
