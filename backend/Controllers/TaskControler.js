const UserModel = require("../Models/User");
const mongoose = require("mongoose");
const createTask = async (req, res) => {
  const data = req.body;
  const { _id } = req.user;

  try {
    const userData = await UserModel.findByIdAndUpdate(
      _id,
      { $push: { tasks: data } },
      { new: true }
    );

    res.status(200).json({
      message: "Task is created ",
      success: true,
      data: userData?.tasks,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", success: false });
  }
};

const fetchAllTasks = async (req, res) => {
  const { _id } = req.user;

  try {
    const userData = await UserModel.findById(_id).select("tasks");
    res.status(200).json({
      message: "Fetch tasks successfully.",
      success: true,
      data: userData?.tasks,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", success: false });
  }
};
const updateTaskById = async (req, res) => {
  const { _id } = req.user; // User ID from the JWT token
  const { id } = req.params; // Task ID from the URL params
  const updatedTaskData = req.body; // Data to update the task with

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid task ID.",
        success: false,
      });
    }

    const userData = await UserModel.findOne({ _id, "tasks._id": id });

    if (!userData) {
      return res.status(404).json({
        message: "User or Task not found.",
        success: false,
      });
    }

    const updatedTask = userData.tasks.id(id);
    updatedTask.set(updatedTaskData);

    await userData.save();

    res.status(200).json({
      message: "Task updated successfully.",
      success: true,
      data: userData?.tasks,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update task",
      success: false,
    });
  }
};

const deleteTaskById = async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;

  try {
    const userData = await UserModel.findByIdAndUpdate(
      _id,
      { $pull: { tasks: { _id: id } } },
      { new: true }
    );

    res.status(200).json({
      message: "Task deleted successfully.",
      success: true,
      data: userData?.tasks,
    });
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
