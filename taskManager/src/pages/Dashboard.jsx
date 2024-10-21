import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import { createTask, deleteTaskById, getAllTask, updateTaskById } from "../api";

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

  // New filter states
  const [filterByDate, setFilterByDate] = useState(""); // For due date filtering
  const [filterByStatus, setFilterByStatus] = useState("all"); // For status filtering (all, pending, completed)

  const handleAddTodo = async () => {
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

    // Add new todo only
    if (currentTodoIndex === null) {
      try {
        await createTask(newTodo); // Call API to create a new task
        handleSuccess("Task added successfully");
        resetForm();
        setModalOpen(false);
        fetchAllTasks(); // Refresh task list
      } catch (err) {
        handleError(err);
      }
    } else {
      handleError("Invalid operation for adding todo.");
    }
  };
  const fetchAllTasks = async () => {
    try {
      const { data } = await getAllTask();

      const processedData = data.map((todo) => ({
        ...todo,
        isPending: todo.isPending ?? todo.isCompleted,
        isCompleted: todo.isCompleted ?? todo.isPending,
      }));

      setTodos(processedData);
    } catch (err) {
      handleError(err);
    }
  };
  useEffect(() => {
    fetchAllTasks();
  }, []);
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

  const handleEditTodo = (todo) => {
    if (!todo) {
      handleError("Todo item is undefined.");
      return;
    }

    const { _id, taskName, description, dueDate, isPending, isCompleted } =
      todo;

    // Log to verify the todo and its _id
    console.log("Editing todo:", todo);
    console.log("Current Todo ID:", _id);

    // Check if _id is valid before setting state
    if (_id) {
      setTaskName(taskName);
      setDescription(description);
      setDueDate(dueDate);
      setIsPending(isPending);
      setIsCompleted(isCompleted);
      setCurrentTodoIndex(_id); // Set the currentTodoIndex to the todo's _id
      setModalOpen(true); // Open modal for editing
    } else {
      handleError("No valid task selected for editing.");
    }
  };

  // New function to handle the submission of the form in the modal
  const handleUpdateTodo = async () => {
    if (!currentTodoIndex) {
      handleError("No task selected to update.");
      return;
    }

    // Create the updated task object
    const updatedTodo = {
      _id: currentTodoIndex,
      taskName,
      description,
      dueDate,
      isPending,
      isCompleted,
    };

    try {
      // Make API call to update the task by its ID
      await updateTaskById(currentTodoIndex, updatedTodo);

      // Update the local state (todos) after successful API call
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t._id === currentTodoIndex ? { ...t, ...updatedTodo } : t
        )
      );

      handleSuccess("Task updated successfully");
      setModalOpen(false); // Close the modal after successful update
      resetForm(); // Reset form to prepare for next task update/addition
    } catch (error) {
      handleError(error);
    }
  };

  // Reset form fields

  // Corrected: Handle deletion based on the todo's unique identifier (index of original todos list)
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTaskById(id);
      handleSuccess("Task deleted successfully");
      fetchAllTasks();
    } catch (err) {
      handleError(err);
    }
  };

  // Apply filters to todos
  const filteredTodos = todos.filter((todo) => {
    // Filter by status
    if (filterByStatus === "pending" && (!todo.isPending || todo.isCompleted)) {
      return false;
    }
    if (filterByStatus === "completed" && !todo.isCompleted) {
      return false;
    }

    // Filter by due date
    if (filterByDate && todo.dueDate !== filterByDate) {
      return false;
    }

    return true;
  });

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-center font-bold text-4xl mt-6">
        Welcome to {loggedInUser} tasks
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

        {/* Filter UI */}
        <div className="flex flex-col md:flex-row justify-center gap-4 my-4">
          {/* Filter by Due Date */}
          <div>
            <label htmlFor="filterDate" className="block mb-2">
              Filter by Due Date:
            </label>
            <input
              type="date"
              id="filterDate"
              value={filterByDate}
              onChange={(e) => setFilterByDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>

          {/* Filter by Status */}
          <div>
            <label htmlFor="filterStatus" className="block mb-2">
              Filter by Status:
            </label>
            <select
              id="filterStatus"
              value={filterByStatus}
              onChange={(e) => setFilterByStatus(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

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
                required
              />

              <label className="block mb-2">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full mb-4"
                placeholder="Enter task description"
                required
              ></textarea>

              <label className="block mb-2">Due Date:</label>
              <input
                type="date"
                value={dueDate.split("T")[0]} // Ensure it's formatted as YYYY-MM-DD
                onChange={(e) => setDueDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full mb-4"
                required
              />

              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={isPending}
                  onChange={(e) => {
                    setIsPending(e.target.checked);
                    if (e.target.checked) {
                      setIsCompleted(false);
                    }
                  }}
                  className="mr-2"
                />
                Is Pending
              </label>

              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => {
                    setIsCompleted(e.target.checked);
                    if (e.target.checked) {
                      setIsPending(false);
                    }
                  }}
                  className="mr-2"
                />
                Is Completed
              </label>

              <button
                onClick={
                  currentTodoIndex !== null ? handleUpdateTodo : handleAddTodo
                } // Conditional handler
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
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 shadow-md min-h-[50px]">
              <ul className="list-disc pl-5 mb-4">
                {filteredTodos.filter((todo) => todo.isPending).length > 0 ? (
                  filteredTodos
                    .filter((todo) => todo.isPending)
                    .map((todo) => (
                      <li
                        key={todo._id} // Use the todo's _id as the key instead of index
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
                            onClick={() => handleEditTodo(todo)} // Pass only the todo object
                            className="text-blue-500 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo._id)} // Use the todo's _id
                            className="text-red-500"
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
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 shadow-md min-h-[50px]">
              <ul className="list-disc pl-5 mb-4">
                {filteredTodos.filter((todo) => todo.isCompleted).length > 0 ? (
                  filteredTodos
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
                            onClick={
                              () => handleEditTodo(todo) // Pass correct index
                            }
                            className="text-blue-500 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={
                              () => handleDeleteTodo(todo._id) // Pass correct index
                            }
                            className="text-red-500"
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
