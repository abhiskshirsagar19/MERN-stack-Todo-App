const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Taskschema = new Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isPending: {
      type: String,
      required: true,
      default: true,
    },
    isCompleted: {
      type: String,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("todo", Taskschema);
module.exports = TaskModel;
