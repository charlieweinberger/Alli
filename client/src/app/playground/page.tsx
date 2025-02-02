"use client";

import ReconnectingWebSocket from "reconnecting-websocket";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

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
        if (response.emotions) {
          if (response.emotions[2].score * 100 > 50) {
            toast({
              title: "Emotion Detected",
              description: "You Seem Distressed Consider taking a break!",
              variant: "destructive",
            });
          }
        }
        setMessage((prevMessage) => {
          if (!prevMessage || !prevMessage.emotions || !response.emotions)
            return response;
          return {
            ...response,
            emotions: response.emotions.map((emotion: Emotion) => ({
              ...emotion,
              score:
                0.7 * emotion.score +
                0.3 *
                  (prevMessage.emotions!.find((e) => e.name === emotion.name)
                    ?.score || 0),
            })),
          };
        });
        setIsProcessing(false);
      } catch (error) {
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
  }, [toast]);

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
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-50 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Emotion Analysis</h2>

      {isProcessing && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        </div>
      )}
      <div>
        {message?.error ? (
          <div className="text-red-500 p-2 rounded">Error: {message.error}</div>
        ) : message?.emotions ? (
          <div className="space-y-2">
            {message.emotions.map((emotion, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{emotion.name}</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${emotion.score * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm">
                  {(emotion.score * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No analysis data available</p>
        )}
        {message?.face_detected !== undefined && (
          <p className="mt-2 text-sm">
            Face detected: {message.face_detected ? "Yes" : "No"}
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
          <video ref={videoRef} autoPlay muted className="w-full h-full" />
        </div>
      )}
    </div>
  );
}
