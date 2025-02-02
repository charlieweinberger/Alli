import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { User } from "@/lib/types";

const Login = () => {
  const [username, setUsername] = useState("");
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/users");
    const users: User[] = await response.json();
    const user = users.find((u: User) => u.username === username);
    if (user) {
      auth.login(user);
    } else {
      alert("User not found");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
