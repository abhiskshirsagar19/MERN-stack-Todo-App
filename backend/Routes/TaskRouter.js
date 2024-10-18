const {
  createTask,
  fetchAllTasks,
  updateTaskById,
  deleteTaskById,
} = require("../Controllers/TaskControler");
const ensureAuthenticated = require("../MiddleWare/Auth");

const router = require("express").Router();

// To get all the tasks
router.get("/", ensureAuthenticated, fetchAllTasks);

//To create the task
router.post("/", ensureAuthenticated, createTask);

//To get all the tasks
// router.get("/", fetchAllTasks);

//To update task
router.put("/:id", ensureAuthenticated, updateTaskById);

//To delete the task
router.delete("/:id", ensureAuthenticated, deleteTaskById);
module.exports = router;
