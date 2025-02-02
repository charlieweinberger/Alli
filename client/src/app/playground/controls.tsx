import { useVoice } from "@humeai/voice-react";
import { text } from "drizzle-orm/pg-core";

export const VoiceControls = () => {
  const { connect, disconnect, status, isMuted, mute, unmute, messages } =
    useVoice();

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={connect}
        disabled={status.value === "connecting" || status.value === "connected"}
        className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {status.value === "connected" ? "Connected" : "Connect"}
      </button>
      <button
        onClick={disconnect}
        disabled={status.value === "disconnected"}
        className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        Disconnect
      </button>
      <button
        onClick={() => (isMuted ? unmute() : mute())}
        disabled={status.value !== "connected"}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
      <div className="text-sm text-gray-600">
        Status: {status.value.charAt(0).toUpperCase() + status.value.slice(1)}
        {status.value === "error" && status.reason && ` (${status.reason})`}
      </div>
      <div className="text-sm text-gray-600">
        {messages.map((message, index) => (
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
        ))}
      </div>
    </div>
  );
};
