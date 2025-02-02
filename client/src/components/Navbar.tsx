import { Button } from "@/components/ui/button";
import { StickyNote, MessageCircle, Volume2, Sun, CircleUserRound, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex items-center w-full bg-rose-400 text-white p-2">
      
      <div className="flex-1">
        <Button variant="ghost"><StickyNote /></Button>
        <Button variant="ghost"><MessageCircle /></Button>
        <Button variant="ghost"><Volume2 /></Button>
      </div>
      
      <div className="flex-1 text-center font-bold text-3xl">
        Alli
      </div>

      <div className="flex-1 flex justify-end">
        <Button variant="ghost"><Sun /></Button>
        <Button variant="ghost"><CircleUserRound /></Button>
        <Button variant="ghost"><Settings /></Button>
      </div>

    </div>
  );
}