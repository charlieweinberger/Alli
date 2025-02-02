import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { User } from "@/lib/types";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/users");
    const users: User[] = await response.json();
    const user = users.find((u: User) => u.username === username);
    if (user) {
      auth.signIn(user);
      // make user go to /posts
      router.push("/posts");
    } else {
      alert("User not found");
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-56px)]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign In
        </h2>
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-rose-400 hover:bg-rose-500 text-white py-2 px-4 rounded-md transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
