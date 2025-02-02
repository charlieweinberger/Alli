import { useVoice } from "@humeai/voice-react";
import React, { useMemo, useEffect, useRef } from "react";

export const VoiceControls = React.memo(() => {
  const { connect, disconnect, status, isMuted, mute, unmute, messages } =
    useVoice();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Memoize the messages to avoid unnecessary re-renders
  const renderedMessages = useMemo(() => {
    return messages.map((message, index) => (
      <div
        key={index}
        className={`p-2 mb-2 rounded-lg ${
          message.type === "user_message"
            ? "bg-blue-100 text-blue-800"
            : message.type === "assistant_message"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {(message.type === "user_message" ||
          message.type === "assistant_message") && (
          <>
            <span className="font-bold">
              {message.type === "user_message" ? "You: " : "Assistant: "}
            </span>
            {message.message.content}
          </>
        )}
      </div>
    ));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="absolute top-4 right-4 p-4 bg-black/60 rounded-xl shadow-lg w-80 backdrop-blur-md border border-gray-200 flex flex-col gap-3">
      {/* Connection Controls */}
      <div className="flex gap-2">
        <button
          onClick={connect}
          disabled={
            status.value === "connecting" || status.value === "connected"
          }
          className="flex-1 bg-green-500 text-white px-3 py-1 rounded-lg disabled:opacity-50 hover:bg-green-600 transition"
        >
          {status.value === "connecting"
            ? "Connecting..."
            : status.value === "connected"
            ? "Connected"
            : "Connect"}
        </button>
        <button
          onClick={disconnect}
          disabled={status.value === "disconnected"}
          className="flex-1 bg-red-500 text-white px-3 py-1 rounded-lg disabled:opacity-50 hover:bg-red-600 transition"
        >
          Disconnect
        </button>
      </div>

      {/* Mute Controls */}
      <button
        onClick={() => (isMuted ? unmute() : mute())}
        disabled={status.value !== "connected"}
        className="bg-blue-500 text-white px-3 py-1 rounded-lg disabled:opacity-50 hover:bg-blue-600 transition"
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>

      {/* Status Display */}
      <div className="text-sm text-gray-200">
        <strong>Status:</strong>{" "}
        {status.value.charAt(0).toUpperCase() + status.value.slice(1)}
        {status.value === "error" && status.reason && ` (${status.reason})`}
      </div>

      {/* Messages Display */}
      <div className="text-sm text-gray-200 max-h-40 overflow-y-auto p-2 bg-gray-800 rounded-md">
        {renderedMessages.length > 0 ? (
          <>
            {renderedMessages}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="p-2 text-gray-400">No messages yet.</div>
        )}
      </div>
    </div>
  );
});

VoiceControls.displayName = "VoiceControls";