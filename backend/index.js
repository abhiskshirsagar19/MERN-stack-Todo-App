const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on Port =${PORT}`);
});
