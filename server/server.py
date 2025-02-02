import asyncio
from functools import lru_cache
import logging
import cv2
from fastapi import FastAPI, HTTPException, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
from hume import AsyncHumeClient
from hume.expression_measurement.stream import Config
from hume.expression_measurement.stream.socket_client import StreamConnectOptions
import os
from hume.expression_measurement.stream.types import StreamFace
load_dotenv()
HUME_API_KEY = os.getenv("NEXT_PUBLIC_HUME_API_KEY")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@lru_cache(maxsize=1)
def get_hume_client():
    return AsyncHumeClient(api_key=HUME_API_KEY)


async def process_image_stream(websocket: WebSocket):
    client = get_hume_client()
    model_config = Config(face=StreamFace())
    stream_options = StreamConnectOptions(config=model_config)

    async with client.expression_measurement.stream.connect(options=stream_options) as socket:
        while True:
            try:
                image_data = await asyncio.wait_for(websocket.receive_bytes(), timeout=5.0)

                # Convert raw frame data to numpy array
                nparr = np.frombuffer(image_data, np.uint8)
                # Decode and resize the image for better performance
                image = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
                # Reduce size to 640x480
                image = cv2.resize(image, (2560, 1440))
                # Enhance contrast and brightness
                image = cv2.convertScaleAbs(image, alpha=1.2, beta=10)

                image_bgr = cv2.cvtColor(image, cv2.COLOR_RGBA2BGR)

                # Save the image to a temporary file
                temp_file = "temp_image.png"
                cv2.imwrite(temp_file, image_bgr)

                # Send the file to Hume
                result = await socket.send_file(temp_file)

                # Clean up the temporary file
                os.remove(temp_file)

                # Process the result
                if hasattr(result, 'face') and result.face.predictions:
                    predictions = result.face.predictions[0]
                    processed_emotions = process_emotions(predictions.emotions)
                    await websocket.send_json({
                        "emotions": processed_emotions,
                        "face_detected": True,
                        "face_probability": predictions.prob
                    })
                else:

                    await websocket.send_json({
                        "emotions": [],
                        "face_detected": False,
                        "error": "No face detected"
                    })

            except asyncio.TimeoutError:
                logging.warning("WebSocket receive timeout")
            except Exception as e:
                logging.error(f"Error in image processing: {str(e)}")
                await websocket.send_json({"error": str(e)})
                break

RELEVANT_EMOTIONS = ['Calmness', 'Distress', "Anxiety"]


def process_emotions(emotions):
    relevant_emotions = {
        emotion.name: emotion.score
        for emotion in emotions if emotion.name in RELEVANT_EMOTIONS
    }
    return [{"name": name, "score": score} for name, score in relevant_emotions.items()]


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        await process_image_stream(websocket)
    except WebSocketDisconnect:
        logging.info("WebSocket disconnected")
    finally:
        await websocket.close()


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
