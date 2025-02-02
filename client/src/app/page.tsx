"use client";

import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)] bg-rose-200">
      <SignIn />
      <SignUp />
    </div>
  );
}
