const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: "String",
      require: true,
    },
    email: {
      type: "String",
      require: true,
    },
    password: {
      type: "String",
      require: true,
    },
    tasks: [
      {
        taskName: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        dueDate: {
          type: Date,
          required: true,
          default: Date.now,
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
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
