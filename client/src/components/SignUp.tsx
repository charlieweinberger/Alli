import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface inputType {
  name: string,
  placeholder: string,
  type: string,
  required: boolean,
}

const inputColumn1: inputType[] = [
  {
    name: "username",
    placeholder: "Username",
    type: "text",
    required: true,
  },
  {
    name: "pronouns",
    placeholder: "Pronouns",
    type: "text",
    required: true,
  },
  {
    name: "genderIdentity",
    placeholder: "Gender Identity",
    type: "text",
    required: false,
  },
  {
    name: "hobbies",
    placeholder: "Hobbies",
    type: "text",
    required: false,
  },
];
const inputColumn2: inputType[] = [
  {
    name: "name",
    placeholder: "Full Name",
    type: "text",
    required: true,
  },
  {
    name: "age",
    placeholder: "Age",
    type: "number",
    required: false,
  },
  {
    name: "sexuality",
    placeholder: "Sexual Orientation",
    type: "text",
    required: false,
  },
  {
    name: "major",
    placeholder: "Major",
    type: "text",
    required: false,
  }
];

export default function SignUp() {

  const [formData, setFormData] = useState<Partial<User>>({
    username: "",
    name: "",
    pronouns: "",
    genderIdentity: "",
    sexuality: "",
    bio: "",
    hobbies: "",
    major: "",
    age: 0,
  });

  const auth = useAuth();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value ? parseInt(value) : 0) : value,
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
          auth.signIn(user[0]);
          router.push("/posts");
        } else {
          alert("Error creating user");
        }
      } catch (error) {
        console.error("Error during sign up:", error);
        alert("Error during sign up");
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-6  h-[calc(100vh-56px)]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center">
          Sign Up
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-4">
              {inputColumn1.map(({ name, placeholder, type, required }: inputType, index: number) => {
                return (
                  <div key={index}>
                    <input
                      type={type}
                      name={name}
                      value={formData[name as keyof User]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required={required}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-4">
              {inputColumn2.map(({ name, placeholder, type, required }: inputType, index: number) => {
                return (
                  <div key={index}>
                    <input
                      type={type}
                      name={name}
                      value={formData[name as keyof User]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      required={required}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <textarea 
            name="bio"
            value={formData["bio"]}
            onChange={handleChange}
            placeholder="Bio"
            className="col-span-2 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <Button className="w-full">
          <Link href="/posts">Sign Up</Link>
        </Button>
      </form>
    </div>
  );
}
