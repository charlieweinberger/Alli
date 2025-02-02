"use client"
import { Button } from "@/components/ui/button";
import { Menu, Sun, CircleUserRound, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="flex items-center h-fit w-full bg-red-400  text-white p-2">
      <div className="flex-1">
        <Button variant="ghost">
          <Menu />
        </Button>
      </div>
      
      <div className="flex-1 text-center">
        Alli
      </div>

      <div className="flex-1 flex justify-end gap-1">
        <Button variant="ghost">
          <Sun />
        </Button>
        <Button variant="ghost" onClick={()=>{router.push("/profile")}}>
          <CircleUserRound />
        </Button>
        <Button variant="ghost">
          <Settings />
        </Button>
      </div>
    </div>
  );
}