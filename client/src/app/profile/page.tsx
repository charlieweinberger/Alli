"use client";
import { useAuth } from "@/components/AuthProvider";
import Profile from '@/components/Profile';
export default function ProfilePage() {
    const {user}=useAuth();
    console.log(user);
    return (
      <div>
        <Profile user={user!} /> {/* Use the Profile component */}
      </div>
    );
  }