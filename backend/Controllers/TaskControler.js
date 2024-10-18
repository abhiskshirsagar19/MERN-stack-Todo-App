const TaskModel = require("../Models/TaskModel");

const createTask = async (req, res) => {
  const data = req.body;
  try {
    const model = new TaskModel(data);
    //console.log("data saved", data);
    await model.save();

    res.status(201).json({ message: "Task is created ", success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", success: false });
  }
};

const fetchAllTasks = async (req, res) => {
  try {
    const data = await TaskModel.find({});

    res.status(200).json({ message: "All the Tasks ", success: true, data });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get all tasks", success: false });
  }
};
const updateTaskById = async (req, res) => {
  //console.log("Enter to update Id");
  try {
    const id = req.params.id;
    const body = req.body;
    const obj = { $set: { ...body } };
    await TaskModel.findByIdAndUpdate(id, obj);

    res.status(200).json({ message: "Task Updated ", success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", success: false });
  }
};
const deleteTaskById = async (req, res) => {
  try {
    const id = req.params.id;
    await TaskModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted ", success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", success: false });
  }
};

module.exports = {
  createTask,
  fetchAllTasks,
  updateTaskById,
  deleteTaskById,
};
