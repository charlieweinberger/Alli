"use client";
import { useAuth } from "@/components/AuthProvider";
import { useParams } from "next/navigation";
import React, { useEffect, useCallback } from "react";
import { Connection, Message } from "@/lib/types";

function Page() {
  const { user } = useAuth();
  const currentUserID = user?.userId;
  const respondingTo = useParams().slug;
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [currentConnection, setCurrentConnection] =
    React.useState<Connection | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!currentUserID || !respondingTo) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch connections
      const connectionsResponse = await fetch(
        `/api/connections/?id=${currentUserID}`
      );
      if (!connectionsResponse.ok)
        throw new Error("Failed to fetch connections");
      const connections: Connection[] = await connectionsResponse.json();

      // Find the current connection
      const currentConnection = connections.find(
        (conn) => conn.responder === Number(respondingTo)
      );
      if (!currentConnection) throw new Error("Connection not found");
      setCurrentConnection(currentConnection);

      // Fetch messages
      const messagesResponse = await fetch(
        `/api/messages/?currentUserID=${currentUserID}&respondingTo=${respondingTo}`
      );
      if (!messagesResponse.ok) throw new Error("Failed to fetch messages");
      const { sent, received } = await messagesResponse.json();

      // Combine sent and received messages into a single array
      const combinedMessages = [...sent, ...received];

      // Sort messages by createdAt timestamp (oldest first)
      combinedMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setMessages(combinedMessages);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUserID, respondingTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addMessage = async (content: string) => {
    if (!currentUserID || !respondingTo || !currentConnection) return;

    const tempMessage: Message = {
      id: Date.now(), // Temporary ID
      connectionId: currentConnection.connectId,
      senderId: currentUserID,
      receiverId: Number(respondingTo),
      content: content,
      createdAt: new Date(),
      isRead: false,
    };

    // Optimistically add to UI
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          senderId: currentUserID,
          receiverId: respondingTo,
          isRead: false,
        }),
      });
      if (!response.ok) throw new Error("Failed to send message");

      const newMessage = await response.json();
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessage.id ? newMessage : msg))
      );
    } catch (error) {
      // Remove temporary message if failed
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      console.error("Error sending message:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentConnection) return <div>Connection not found</div>;

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message.id}
          style={{
            textAlign: message.senderId === currentUserID ? "right" : "left",
            color: message.senderId === currentUserID ? "blue" : "green",
          }}
        >
          {message.content}
          <div style={{ fontSize: "0.8em", color: "gray" }}>
            {new Date(message.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
      <SendMessage onSend={addMessage} />
    </div>
  );
}

export default Page;

const SendMessage = ({
  onSend,
}: {
  onSend: (content: string) => Promise<void>;
}) => {
  const [newMessage, setNewMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await onSend(newMessage);
    setNewMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};
