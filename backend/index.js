const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./Models/db");
const PORT = process.env.PORT || 3000;
const TaskRouter = require("./Routes/TaskRouter");
const bodyParser = require("body-parser");
const { fetchAllTasks } = require("./Controllers/TaskControler");
const AuthRouter = require("./Routes/AuthRouter");
// app.get("/", (req, res) => {
//   res.send("Hello from Server");
// });
app.get("/", fetchAllTasks);
app.use(bodyParser.json());
app.use(cors());
app.use("/tasks", TaskRouter);
app.use("/auth", AuthRouter);
app.listen(PORT, () => {
  console.log(`Server is running on Port =${PORT}`);
});
