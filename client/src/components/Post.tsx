import { useState, useEffect } from "react";
import { Post as PostType, User } from "../lib/types";
// import { useAuth } from "./AuthProvider";
import Image from "next/image";
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
          className="flex items-center gap-3 mb-4 cursor-pointer"
          onClick={() => setShowProfile(!showProfile)}
        >
          <img
            src={`https://randomfox.ca/images/${Math.floor(
              Math.random() * 51
            )}.jpg`}
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{sender.name}</p>
            <p className="text-gray-500">@{sender.username}</p>
          </div>
        </div>
      )}
      {showProfile && sender && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p>Gender Identitiy: {sender.genderIdentity}</p>
          <p>Sexualizing: {sender.sexuality}</p>
        </div>
      )}
      <h2 className="text-xl font-bold text-gray-800">{post.title}</h2>
      <p className="text-gray-600">{post.description}</p>
    </div>
  );
};

export const Posts = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
};
