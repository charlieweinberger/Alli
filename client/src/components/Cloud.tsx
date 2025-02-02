"use client";
<<<<<<< HEAD
import React, { useEffect, useState } from "react";

const Clouds: React.FC = () => {
=======

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Clouds() {
>>>>>>> 665252bfc240715f0d9a473fd1513ca00f34a970
  const [clouds, setClouds] = useState<number[]>([]);

  useEffect(() => {
    // Generate random number of clouds (between 5 and 10)
    const numClouds = Math.floor(Math.random() * 6) + 5;
    const cloudArray = Array.from({ length: numClouds }, (_, i) => i);
    setClouds(cloudArray);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {clouds.map((cloud) => {
        // Randomize cloud size, speed, and delay
        const size = Math.floor(Math.random() * 200) + 100; // 100px to 300px
        const duration = Math.floor(Math.random() * 200) + 10; // 10s to 30s
        const delay = Math.floor(Math.random() * 20); // 0s to 20s delay
        const top = Math.floor(Math.random() * 100); // Random vertical position

        return (
          <img
            key={cloud}
            src="/cloud.png" // Replace with your cloud image
            alt="Cloud"
            className="absolute opacity-70"
            width={size}
            height={size}
            style={{
              top: `${top}%`,
              animation: `slide ${duration + 5}s linear ${delay}s infinite`,
            }}
          />
        );

      })}
    </div>
  );
}
