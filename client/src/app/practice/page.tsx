"use client";

import ReconnectingWebSocket from "reconnecting-websocket";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoiceProvider } from "@humeai/voice-react";

interface Emotion {
  name: string;
  score: number;
}

interface HumeResponse {
  emotions?: Emotion[];
  face_detected?: boolean;
  face_probability?: number;
  error?: string;
}

interface EmotionalAnalysisProps {
  data: ArrayBuffer | null;
}

const EmotionalAnalysis = ({ data }: EmotionalAnalysisProps) => {
  const [message, setMessage] = useState<HumeResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const websocketRef = useRef<ReconnectingWebSocket | null>(null);
  const lastProcessedTime = useRef<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const ws = new ReconnectingWebSocket("ws://localhost:8001/ws");
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      console.log("WebSocket connection established");
      websocketRef.current = ws;
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.emotions && response.emotions.length > 2) {
          if (response.emotions[2].score * 100 > 30) {
            toast({
              title: "Emotion Detected",
              description: "You Seem Distressed, Try doing it again but a bit calmer!",
              variant: "destructive",
            });
          }
        }
        setMessage((prevMessage) => {
          if (!prevMessage || !prevMessage.emotions || !response.emotions)
            return response;
          const smoothedEmotions = response.emotions.map(
            (emotion: Emotion) => ({
              ...emotion,
              score:
                0.7 * emotion.score +
                0.3 *
                  (prevMessage.emotions!.find((e) => e.name === emotion.name)
                    ?.score || 0),
            })
          );

          // Calculate the sum of all scores
          const totalScore = smoothedEmotions.reduce(
            (sum: number, emotion: Emotion) => sum + emotion.score,
            0
          );

          // Normalize the scores
          return {
            ...response,
            emotions: smoothedEmotions.map((emotion: Emotion) => ({
              ...emotion,
              score:
                totalScore > 0 ? emotion.score / totalScore : emotion.score,
            })),
          };
        });
        setIsProcessing(false);
      } catch (error) {
        console.error("Error parsing response:", error);
        setMessage({ error: "Failed to parse server response" });
        setIsProcessing(false);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setMessage({ error: "WebSocket connection error" });
      setIsProcessing(false);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer < 5 ? prevTimer + 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 5 && websocketRef.current && data) {
      setIsProcessing(true);
      websocketRef.current.send(data);
      lastProcessedTime.current = Date.now();
    }
  }, [timer, data]);

  return (
    <div className="fixed top-4 left-72 transform -translate-x-1/2 backdrop-blur-lg bg-black/80 p-6 rounded-2xl shadow-lg z-50 max-w-md w-full border border-gray-200">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
        Emotional Spectrum
      </h2>

      {isProcessing && (
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <div className="animate-spin rounded-full h-5 w-5 border-4 border-rainbow-gradient"></div>
        </div>
      )}
      <div>
        {message?.error ? (
          <div className="text-red-500 p-3 rounded-xl bg-red-50/50">
            Error: {message.error}
          </div>
        ) : message?.emotions ? (
          <div className="space-y-3">
            {message.emotions.map((emotion, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium text-gray-50">
                  {emotion.name}
                </span>
                <div className="w-32 bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 h-3 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${emotion.score * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {(emotion.score * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center italic">
            Awaiting emotional data...
          </p>
        )}
        {message?.face_detected !== undefined && (
          <p className="mt-3 text-sm font-medium text-gray-600 bg-gray-50/50 p-2 rounded-xl">
            Face detected: {message.face_detected ? "✨ Yes" : "Not yet"}
            {message.face_probability &&
              ` (${(message.face_probability * 100).toFixed(1)}%)`}
          </p>
        )}
      </div>
    </div>
  );
};

export default function VideoCall() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [frameData, setFrameData] = useState<ArrayBuffer | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
        setIsCameraLoading(false);
      }
    };

    enableCamera();
    setIsCameraLoading(false);

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const captureFrame = () => {
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 640, 480);
          canvas.toBlob((blob) => {
            if (blob) {
              blob.arrayBuffer().then((buffer) => {
                setFrameData(buffer);
              });
            }
          }, "image/jpeg");
        }
      }
    };

    const intervalId = setInterval(captureFrame, 1000); // Capture frame every second
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      {isCameraLoading ? (
        <div>Loading camera...</div>
      ) : (
        <div className="grid gap-1 flex-1">
          <EmotionalAnalysis data={frameData} />
          <video ref={videoRef} autoPlay muted className="w-full h-[75vh]" />

          <HumeVoiceComponent
            accessToken={process.env.NEXT_PUBLIC_HUME_ACCESS_TOKEN!}
          />
        </div>
      )}
    </div>
  );
}

import { SessionSettings } from "hume/api/resources/empathicVoice";
import { VoiceControls } from "./controls";
interface HumeVoiceProps {
  accessToken: string;
}

export const HumeVoiceComponent: React.FC<HumeVoiceProps> = ({
  accessToken,
}) => {
  const [systemSettings] = useState<SessionSettings>({
    type: "session_settings",
    systemPrompt: `You are a agent, who is a test dummy who will be talked to by an LGBTQ+ Ally who will be talking to you about their experiences and will be practicing asking people out and
    pick up lines on you to practice. You will be supportive and encouraging while giving advice on how to improve.
      `,
  });

  return (
    <VoiceProvider
      auth={{ type: "apiKey", value: accessToken }}
      sessionSettings={systemSettings}
    >
      <VoiceControls />
    </VoiceProvider>
  );
};
