import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md w-96">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-center">
            Sign In
          </h2>
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <Button className="w-full">
            Sign In
          </Button>
        </form>
        <div className="w-full mt-2 mb-[-8px] flex flex-row items-center">
            <p>Don&apos;t have an account?</p>
            <Button variant="link" className="pl-2 pr-0 py-0 text-rose-500">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
      </div>
    </div>
  );
}
