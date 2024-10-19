import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");
  const [todos, setTodos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isPending, setIsPending] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTodoIndex, setCurrentTodoIndex] = useState(null);

  const handleAddTodo = () => {
    if (!taskName) {
      handleError("Please enter a task name");
      return;
    }

    const newTodo = {
      taskName,
      description,
      dueDate,
      isPending,
      isCompleted,
    };

    if (currentTodoIndex !== null) {
      // Update existing todo
      const updatedTodos = todos.map((todo, index) =>
        index === currentTodoIndex ? newTodo : todo
      );
      setTodos(updatedTodos);
      handleSuccess("Task updated successfully");
    } else {
      // Add new todo
      setTodos([...todos, newTodo]);
      handleSuccess("Task added successfully");
    }

    resetForm();
    setModalOpen(false);
  };

  const resetForm = () => {
    setTaskName("");
    setDescription("");
    setDueDate("");
    setIsPending(true);
    setIsCompleted(false);
    setCurrentTodoIndex(null);
  };

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleEditTodo = (index) => {
    const todoToEdit = todos[index];
    setTaskName(todoToEdit.taskName);
    setDescription(todoToEdit.description);
    setDueDate(todoToEdit.dueDate);
    setIsPending(todoToEdit.isPending);
    setIsCompleted(todoToEdit.isCompleted);
    setCurrentTodoIndex(index);
    setModalOpen(true);
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    handleSuccess("Task deleted successfully");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-center font-bold text-4xl mt-6">
        Welcome to {loggedInUser}'s tasks
      </h1>
      <button
        onClick={handleLogout}
        className="bg-slate-700 text-white p-2 rounded-lg uppercase hover:opacity-85 disabled:opacity-80 absolute top-0 right-0 m-2"
      >
        Logout
      </button>
      <div className="flex flex-col items-center justify-center mt-20">
        <button
          onClick={() => setModalOpen(true)}
          id="addButton"
          className="bg-slate-700 mb-1 text-white rounded-lg p-2 hover:opacity-85 w-full max-w-xs"
        >
          Add Todo
        </button>

        {/* Modal for Adding or Editing Todo */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-80">
              <h2 className="text-lg font-bold mb-4">
                {currentTodoIndex !== null ? "Edit Task" : "Add New Task"}
              </h2>
              <label className="block mb-2">Task Name:</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full mb-4"
                placeholder="Enter task name"
              />

              <label className="block mb-2">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full mb-4"
                placeholder="Enter task description"
              ></textarea>

              <label className="block mb-2">Due Date:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full mb-4"
              />

              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={isPending}
                  onChange={() => {
                    setIsPending(true);
                    setIsCompleted(false);
                  }}
                  className="mr-2"
                />
                Is Pending
              </label>

              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => {
                    setIsCompleted(true);
                    setIsPending(false);
                  }}
                  className="mr-2"
                />
                Is Completed
              </label>

              <button
                onClick={handleAddTodo}
                className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 w-full"
              >
                {currentTodoIndex !== null ? "Update" : "Save"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600 w-full mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Horizontal layout for Pending and Completed Tasks */}
        <div className="flex flex-col md:flex-row mt-6 w-full max-w-6xl">
          {/* Pending Tasks Section */}
          <div className="md:w-1/2 w-full md:pr-2 mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-center mb-2">
              Pending Tasks
            </h2>
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 shadow-md min-h-[50px]">
              {/* Setting min-h-[300px] to ensure initial vertical size */}
              <ul className="list-disc pl-5 mb-4">
                {todos.filter((todo) => todo.isPending && !todo.isCompleted)
                  .length > 0 ? (
                  todos
                    .filter((todo) => todo.isPending && !todo.isCompleted)
                    .map((todo, index) => (
                      <li
                        key={index}
                        className="mb-2 flex justify-between items-center"
                      >
                        <div>
                          <strong>{todo.taskName}</strong>
                          <br />
                          {todo.description}
                          <br />
                          <span className="text-sm text-gray-600">
                            Due: {todo.dueDate}
                          </span>
                        </div>
                        <div>
                          <button
                            onClick={() => handleEditTodo(index)}
                            className="text-blue-500 hover:underline ml-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(index)}
                            className="text-red-500 hover:underline ml-2"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))
                ) : (
                  <li>No pending tasks</li>
                )}
              </ul>
            </div>
          </div>

          {/* Completed Tasks Section */}
          <div className="md:w-1/2 w-full md:pl-2">
            <h2 className="text-xl font-semibold text-center mb-2">
              Completed Tasks
            </h2>
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 shadow-md min-h-[72px]">
              {/* Setting min-h-[300px] to ensure initial vertical size */}
              <ul className="list-disc pl-5">
                {todos.filter((todo) => todo.isCompleted).length > 0 ? (
                  todos
                    .filter((todo) => todo.isCompleted)
                    .map((todo, index) => (
                      <li
                        key={index}
                        className="mb-2 flex justify-between items-center"
                      >
                        <div>
                          <strong>{todo.taskName}</strong>
                          <br />
                          {todo.description}
                          <br />
                          <span className="text-sm text-gray-600">
                            Due: {todo.dueDate}
                          </span>
                        </div>
                        <div>
                          <button
                            onClick={() => handleEditTodo(index)}
                            className="text-blue-500 hover:underline ml-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(index)}
                            className="text-red-500 hover:underline ml-2"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))
                ) : (
                  <li>No completed tasks</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
