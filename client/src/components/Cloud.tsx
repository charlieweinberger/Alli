"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Clouds() {
  const [clouds, setClouds] = useState<number[]>([]);

  useEffect(() => {
    // Generate random number of clouds (between 15 and 20)
    const numClouds = Math.floor(Math.random() * 5) + 15;
    const cloudArray = Array.from({ length: numClouds }, (_, i) => i);
    setClouds(cloudArray);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {clouds.map((cloud) => {
        // Randomize cloud size, speed, and delay
        const size = Math.floor(Math.random() * 200) + 100; // 100px to 300px
        const duration = Math.floor(Math.random() * 200) + 10; // 10s to 30s
        const top = Math.floor(Math.random() * 100); // Random vertical position
        const left = Math.floor(Math.random() * 100); // Random horizontal position
        return (
          <Image
            key={cloud}
            src="/cloud.png" // Replace with your cloud image
            alt="Cloud"
            className="absolute opacity-70 select-none"
            width={size}
            height={size}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              animation: `slide ${
                duration + 5
              }s linear infinite alternate`,
            }}
          />
        );
      })}
    </div>
  );
}
