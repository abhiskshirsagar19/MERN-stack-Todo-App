import { API_URL } from "./utils";

export const createTask = async (taskObj) => {
  const url = `${API_URL}/tasks`;
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskObj),
  };
  try {
    const result = await fetch(url, options);
    const data = await result.json();
    return data;
  } catch (err) {
    return err;
  }
};

export const getAllTask = async () => {
  const url = `${API_URL}/`;
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const result = await fetch(url, options);
    const data = await result.json();
    return data;
  } catch (err) {
    return err;
  }
};
export const deleteTaskById = async (id, reqBody) => {
  const url = `${API_URL}/tasks/${id}`;
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reqBody),
  };
  try {
    const result = await fetch(url, options);
    const data = await result.json();
    return data;
  } catch (err) {
    return err;
  }
};
export const updateTaskById = async (id) => {
  const url = `${API_URL}/tasks/${id}`;
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const result = await fetch(url, options);
    const data = await result.json();
    return data;
  } catch (err) {
    return err;
  }
};
