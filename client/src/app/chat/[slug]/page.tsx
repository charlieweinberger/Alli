"use client";
import { useAuth } from "@/components/AuthProvider";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

interface Message {
  messageId: string;
  text: string;
}

function Page() {
  const { user } = useAuth();
  const currentUserID = user?.userId;
  const respondingTo = useParams().slug;
  const [messages, setMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/messages/?currentUserID=${currentUserID}&respondingTo=${respondingTo}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (currentUserID) {
      fetchMessages();
    }
  }, [currentUserID, respondingTo]);
  return (
    <div>
      {messages.map((message) => (
        <div key={message.messageId}>{message.text}</div>
      ))}
    </div>
  );
}

export default Page;
