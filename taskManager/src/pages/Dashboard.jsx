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
      isPending: !isCompleted, // Mutually exclusive check
      isCompleted, // Based on user selection
    };

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
        isPending: todo.isPending, // Use stored values directly
        isCompleted: todo.isCompleted,
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

    if (_id) {
      setTaskName(taskName);
      setDescription(description);
      setDueDate(dueDate);
      setIsPending(isPending);
      setIsCompleted(isCompleted);
      setCurrentTodoIndex(_id);
      setModalOpen(true);
    } else {
      handleError("No valid task selected for editing.");
    }
  };

  const handleUpdateTodo = async () => {
    if (!currentTodoIndex) {
      handleError("No task selected to update.");
      return;
    }

    const updatedTodo = {
      _id: currentTodoIndex,
      taskName,
      description,
      dueDate,
      isPending,
      isCompleted,
    };

    try {
      await updateTaskById(currentTodoIndex, updatedTodo);

      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t._id === currentTodoIndex ? { ...t, ...updatedTodo } : t
        )
      );

      handleSuccess("Task updated successfully");
      setModalOpen(false);
      resetForm();
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTaskById(id);
      handleSuccess("Task deleted successfully");
      fetchAllTasks();
    } catch (err) {
      handleError(err);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterByStatus === "pending" && (!todo.isPending || todo.isCompleted)) {
      return false;
    }
    if (filterByStatus === "completed" && !todo.isCompleted) {
      return false;
    }
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

        {/* Filters Section */}
        <div className="mt-6">
          <label className="block mb-2">Filter by Due Date:</label>
          <input
            type="date"
            value={filterByDate}
            onChange={(e) => setFilterByDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full max-w-xs mb-4"
          />
          <label className="block mb-2">Filter by Status:</label>
          <select
            value={filterByStatus}
            onChange={(e) => setFilterByStatus(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full max-w-xs"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
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
                value={dueDate ? dueDate.split("T")[0] : ""}
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
                }
                className="bg-blue-500 text-white rounded-md p-2 w-full"
              >
                {currentTodoIndex !== null ? "Update Task" : "Add Task"}
              </button>

              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                className="bg-gray-500 text-white rounded-md p-2 w-full mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tasks Lists */}
        {/* <div className="flex gap-80">
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Completed Tasks</h2>
            <ul>
              {filteredTodos
                .filter((todo) => todo.isCompleted)
                .map((todo) => (
                  <li
                    key={todo._id}
                    className="bg-green-300 shadow-md p-4 mb-2 rounded-lg"
                  >
                    <h3 className="font-bold">{todo.taskName}</h3>
                    <p>{todo.description}</p>
                    <p>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="bg-gray-500 text-white rounded-md p-2 mt-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="bg-red-500 text-white rounded-md p-2 mt-2 ml-3"
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Pending Tasks</h2>
            <ul>
              {filteredTodos
                .filter((todo) => !todo.isCompleted)
                .map((todo) => (
                  <li
                    key={todo._id}
                    className="bg-sky-300 shadow-md p-4 mb-2 rounded-md"
                  >
                    <h3 className="font-bold">{todo.taskName}</h3>
                    <p>{todo.description}</p>
                    <p>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="bg-gray-500 text-white rounded-md p-2 mt-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="bg-red-500 text-white rounded-md p-2 mt-2 ml-3"
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div> */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 lg:gap-80">
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Completed Tasks</h2>
            <ul>
              {filteredTodos
                .filter((todo) => todo.isCompleted)
                .map((todo) => (
                  <li
                    key={todo._id}
                    className="bg-green-300 shadow-md p-4 mb-2 rounded-lg"
                  >
                    <h3 className="font-bold">{todo.taskName}</h3>
                    <p>{todo.description}</p>
                    <p>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="bg-gray-500 text-white rounded-md p-2 mt-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="bg-red-500 text-white rounded-md p-2 mt-2 ml-3"
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Pending Tasks</h2>
            <ul>
              {filteredTodos
                .filter((todo) => !todo.isCompleted)
                .map((todo) => (
                  <li
                    key={todo._id}
                    className="bg-sky-300 shadow-md p-4 mb-2 rounded-md"
                  >
                    <h3 className="font-bold">{todo.taskName}</h3>
                    <p>{todo.description}</p>
                    <p>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="bg-gray-500 text-white rounded-md p-2 mt-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="bg-red-500 text-white rounded-md p-2 mt-2 ml-3"
                    >
                      Delete
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
