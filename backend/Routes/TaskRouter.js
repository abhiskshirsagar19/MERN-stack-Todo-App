const {
  createTask,
  fetchAllTasks,
  updateTaskById,
  deleteTaskById,
} = require("../Controllers/TaskControler");

const router = require("express").Router();

// To get all the tasks
router.get("/", fetchAllTasks);

//To create the task
router.post("/", createTask);

//To get all the tasks
// router.get("/", fetchAllTasks);

//To update task
router.put("/:id", updateTaskById);

//To delete the task
router.delete("/:id", deleteTaskById);
module.exports = router;
