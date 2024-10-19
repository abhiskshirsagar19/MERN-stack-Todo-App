import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
export default function Dashboard() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  });
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("User logged-out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  return (
    <div>
      <h1 className="text-center font-bold text-4xl mt-6">
        Welcome to {loggedInUser} tasks
      </h1>
      <button
        onClick={handleLogout}
        className="bg-slate-700 text-white  p-2 rounded-lg uppercase hover:opacity-85 disable:opacity-80 absolute top-0 right-0 m-2"
      >
        Logout
      </button>
      <ToastContainer />
    </div>
  );
}
