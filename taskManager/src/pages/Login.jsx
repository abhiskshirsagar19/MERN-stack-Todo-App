import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
export default function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyRegisterInfo = { ...loginInfo };
    copyRegisterInfo[name] = value;
    setLoginInfo(copyRegisterInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email, Password required.");
    }
    try {
      const url = "http://localhost:3000/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Login</h1>
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="email"
          name="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          value={loginInfo.email}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          value={loginInfo.password}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white  p-3 rounded-lg uppercase hover:opacity-95 disable:opacity-80 "
        >
          Login
        </button>
      </form>
      <div className="flex gap-2 mt-5 ">
        <p>Don't have an account?</p>
        <Link to={"/signup"}>
          <span className="text-blue-700">Register</span>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
}
