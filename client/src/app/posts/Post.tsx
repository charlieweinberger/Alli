import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Post as PostType, User } from "../../lib/types";
import { useAuth } from "../../components/AuthProvider";
import { Button } from "@/components/ui/button";

type Props = {
  post: PostType;
};

function MakeConnection({ user, responder }: { user: User; responder: User }) {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const _response = await fetch("/api/connections", {
      method: "POST",
      body: JSON.stringify({
        user: user.userId,
        responder: responder.userId,
      }),
    });
    if (_response.ok) {
      console.log("Connected");
    }
    router.push(`/chat/${responder.userId}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button>Connect</Button>
    </form>
  );
}

function ProfileImage() {
  return (
    <div className="relative w-12 h-12 rounded-full overflow-hidden">
      <Image
        src={`https://randomfox.ca/images/${Math.floor(
          Math.random() * 51
        )}.jpg`}
        alt="profile"
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

export default function Post({ post }: Props) {
  const user = useAuth();
  const [sender, setSender] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchSender = async () => {
      const response = await fetch(`/api/users?id=${post.userId}`);
      const data = await response.json();
      setSender(data);
    };
    fetchSender();
  }, [post.userId]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {sender && (
        <div
          className="flex items-center gap-3 mb-4 cursor-pointer relative"
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        >
          <ProfileImage />
          <div>
            <p className="font-medium">{sender.name}</p>
            <p className="text-gray-500">@{sender.username}</p>
          </div>
          {showProfile && sender && (
            <div
              className="absolute z-10 p-3 bg-white shadow-lg rounded border border-gray-200"
              style={{
                position: "fixed",
                transform: "translate(50px, 60px)",
                pointerEvents: "none",
              }}
            >
              <p>Gender Identity: {sender.genderIdentity}</p>
              <p>Sexual Orientation: {sender.sexuality}</p>
            </div>
          )}
        </div>
      )}
      <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
      <p className="text-gray-600">{post.description}</p>
      {sender && user && user.user && user.user?.userId !== post.userId && (
        <MakeConnection user={user.user!} responder={sender!} />
      )}
    </div>
  );
}
