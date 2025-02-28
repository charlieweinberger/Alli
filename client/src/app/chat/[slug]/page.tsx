"use client";
import { useAuth } from "@/components/AuthProvider";
import { useParams } from "next/navigation";
import React, {
  useEffect,
  useCallback,
  useRef,
  useOptimistic,
  useTransition,
} from "react";
import { Loader } from 'lucide-react';
import { Connection, Message } from "@/lib/types";
import { useConnections } from "../layout";

const MessageList = React.memo(
  ({
    messages,
    currentUserID,
  }: {
    messages: Message[];
    currentUserID: number | undefined;
  }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
      <div className="flex flex-col space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.senderId === currentUserID ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                message.senderId === currentUserID
                  ? "bg-rose-500 text-white"
                  : "bg-white text-rose-400"
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  }
);

MessageList.displayName = "MessageList";

const ChatContainer = ({
  currentUserID,
  currentConnection,
  serverMessages,
  addMessage,
}: {
  currentUserID: number | undefined;
  currentConnection: Connection;
  serverMessages: Message[];
  addMessage: (content: string) => Promise<Message>;
}) => {
  const [isPending, startTransition] = useTransition();
  const [messages, addOptimisticMessage] = useOptimistic(
    serverMessages,
    (state: Message[], newMessage: Message) => [...state, newMessage]
  );

  const handleSendMessage = async (content: string) => {
    if (!currentUserID || !currentConnection) return;

    const tempMessage: Message = {
      id: -Date.now(), // Using negative number for temp IDs
      connectionId: currentConnection.connectId,
      senderId: currentUserID,
      receiverId: currentConnection.responder,
      content: content,
      createdAt: new Date(),
      isRead: false,
    };

    startTransition(() => {
      // Add optimistic message only if the sender is the current user
      if (tempMessage.senderId === currentUserID) {
        addOptimisticMessage(tempMessage);
      }
    });

    try {
      await addMessage(content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navbar (if any) */}
      {/* <Navbar /> */}

      {/* Scrollable Message List */}
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} currentUserID={currentUserID} />
      </div>

      {/* Fixed Message Input Area */}
      <div className="p-4 border-t bg-pink-50">
        <SendMessage onSend={handleSendMessage} disabled={isPending} />
      </div>
    </div>
  );
};

export default function Page() {
  const { user } = useAuth();
  const currentUserID = user?.userId;
  const respondingTo = useParams().slug;
  const { connections } = useConnections();
  const currentConnection = connections.find(
    (conn) => conn.responder === Number(respondingTo) && conn.user === currentUserID
  );

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  if (!isPending) {}
  const fetchData = useCallback(async () => {
    if (!currentUserID || !respondingTo) return;

    try {
      const messagesResponse = await fetch(
        `/api/chat/?currentUserID=${currentUserID}&respondingTo=${respondingTo}`
      );
      if (!messagesResponse.ok) throw new Error("Failed to fetch messages");

      const { sent, received } = await messagesResponse.json();
      const combinedMessages = [...sent, ...received].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      startTransition(() => {
        setMessages(combinedMessages);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUserID, respondingTo]);

  const addMessage = async (content: string): Promise<Message> => {
    if (!currentUserID || !currentConnection) {
      throw new Error("Invalid user or connection");
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        connectionId: currentConnection.connectId,
        senderId: currentUserID,
        receiverId: currentConnection.responder,
        isRead: false,
      }),
    });

    if (!response.ok) throw new Error("Failed to send message");
    const newMessage = await response.json();

    startTransition(() => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return newMessage;
  };

  useEffect(() => {
    fetchData();
    const pollInterval = setInterval(fetchData, 5000);
    return () => clearInterval(pollInterval);
  }, [fetchData]);

  if (isLoading || error || !currentConnection) {

    const message = isLoading ? "Loading..." : (error ? `Error: ${error}` : "Select a user from the sidebar to start a chat.");

    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center justify-center bg-white p-6 rounded-lg shadow-md w-48">
          {message}
        </div>
      </div>
    );

  }

  return (
    <ChatContainer
      currentUserID={currentUserID}
      currentConnection={currentConnection}
      serverMessages={messages}
      addMessage={addMessage}
    />
  );
}

const SendMessage = React.memo(
  ({
    onSend,
    disabled,
  }: {
    onSend: (content: string) => Promise<void>;
    disabled: boolean;
  }) => {
    const [newMessage, setNewMessage] = React.useState("");
    const [isSending, setIsSending] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || isSending || disabled) return;

      try {
        setIsSending(true);
        await onSend(newMessage);
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSending(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          disabled={isSending || disabled}
        />
        <button
          type="submit"
          disabled={isSending || disabled}
          className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center"
        >
          {isSending ? <Loader className="animate-spin" size={18} /> : "Send"}
        </button>
      </form>
    );
  }
);

SendMessage.displayName = "SendMessage";
