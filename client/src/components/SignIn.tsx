import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { User } from "@/lib/types";

const SignIn = () => {
  const [formData, setFormData] = useState<Partial<User>>({
    username: "",
    name: "",
    pronouns: "",
    genderIdentity: "",
    sexuality: "",
    bio: "",
    hobbies: "",
    major: "",
    age: undefined,
  });

  const auth = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username?.trim()) {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const user = await response.json();
          auth.login(user);
        } else {
          alert("Error creating user");
        }
      } catch (error) {
        console.error("Error during sign in:", error);
        alert("Error during sign in");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign In
        </h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="pronouns"
              value={formData.pronouns}
              onChange={handleChange}
              placeholder="Pronouns"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="genderIdentity"
              value={formData.genderIdentity}
              onChange={handleChange}
              placeholder="Gender Identity"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="sexuality"
              value={formData.sexuality}
              onChange={handleChange}
              placeholder="Sexuality"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Bio"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              placeholder="Hobbies"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              placeholder="Major"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="number"
              name="age"
              value={formData.age || ""}
              onChange={handleChange}
              placeholder="Age"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
