"use client";
import { useAuth } from "@/components/AuthProvider";
import React from "react";

function page() {
  const { user } = useAuth();
  const currentUserID = user?.userId;
  return <div>{currentUserID}</div>;
}

export default page;
