import { useState, useEffect } from "react";
import { Post as PostType, User } from "../lib/types";
// import { useAuth } from "./AuthProvider";
import Image from "next/image";
import { useAuth } from "./AuthProvider";
type Props = {
  post: PostType;
};

export const Post = ({ post }: Props) => {
  //   const user = useAuth();
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
              <p>Sexuality: {sender.sexuality}</p>
            </div>
          )}
        </div>
      )}
      <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
      <p className="text-gray-600">{post.description}</p>
    </div>
  );
};

const ProfileImage = () => {
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

export const Posts = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/posts");
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <MakePost onPostCreated={fetchPosts} />

      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
};

export const MakePost = ({ onPostCreated }: { onPostCreated: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        userId: user.userId,
        createdAt: new Date(),
      }),
    });
    if (response.ok) {
      setTitle("");
      setDescription("");
      onPostCreated(); // Fetch posts again after successful creation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border border-gray-200 rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border border-gray-200 rounded"
      />
      <button className="bg-blue-500 text-white p-2 rounded">Post</button>
    </form>
  );
};
