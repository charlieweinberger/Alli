"use client";

import { useState, useEffect } from "react";
import { Post as PostType } from "../../lib/types";
import { useAuth } from "../../components/AuthProvider";
import Post from "./Post";
import { Button } from "@/components/ui/button";

function MakePost({ onPostCreated }: { onPostCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();

  if (!user) {
    console.log("hi");
    return null;
  }

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
        className="p-2 border rounded border-gray-200 focus:outline-rose-500"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border rounded border-gray-200 focus:outline-rose-500"
      />
      <Button>Post</Button>
    </form>
  );
};

export default function Posts() {
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
    <div className="flex flex-col items-center justify-center p-4 gap-4 bg-rose-200">
      <div className="p-4 bg-rose-300 rounded-lg">
        <MakePost onPostCreated={fetchPosts} />
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        {posts.map((post) => (
          <Post key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
}
