import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
export default function SignUp() {
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyRegisterInfo = { ...registerInfo };
    copyRegisterInfo[name] = value;
    setRegisterInfo(copyRegisterInfo);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password } = registerInfo;
    if (!name || !email || !password) {
      return handleError("Name, Email, Password required.");
    }
    try {
      const url = "http://localhost:3000/auth/register";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(registerInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
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
      <h1 className="text-3xl text-center font-semibold my-7">Register</h1>
      <form className="flex flex-col gap-4" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          name="name"
          className="border p-3 rounded-lg"
          autoFocus
          onChange={handleChange}
          value={registerInfo.name}
        />
        <input
          type="text"
          placeholder="email"
          name="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          value={registerInfo.email}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          value={registerInfo.password}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white  p-3 rounded-lg uppercase hover:opacity-95 disable:opacity-80 "
        >
          Register
        </button>
      </form>
      <div className="flex gap-2 mt-5 ">
        <p>Already have an account?</p>
        <Link to={"/login"}>
          <span className="text-blue-700">Login</span>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
}
