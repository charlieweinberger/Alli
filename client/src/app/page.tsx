"use client";

import Login from "@/components/Login";
import { MakePost, Posts } from "@/components/Post";

export default function Home() {
  return (
    <div className="p-20 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <Login />
      <MakePost />
      <Posts />
    </div>
  );
}
