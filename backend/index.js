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
const ensureAuthenticated = require("./MiddleWare/Auth");

// app.get("/", (req, res) => {
//   res.send("Hello from Server");
// });

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", AuthRouter);
app.use("/tasks", ensureAuthenticated, TaskRouter);
app.use("/", fetchAllTasks);
app.listen(PORT, () => {
  console.log(`Server is running on Port =${PORT}`);
});
