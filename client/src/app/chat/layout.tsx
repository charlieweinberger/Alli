"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Connection } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const currentUserID = user?.userId;
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch(`/api/connections/?id=${currentUserID}`);
        const data = await response.json();
        setConnections(data);
        setResponders(data.map((conn: Connection) => conn.responder));
        console.log("Connections:", data);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    if (currentUserID) {
      fetchConnections();
    }
  }, [currentUserID]);

  return (
    <div className="flex">
      <aside className="w-64 h-screen bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Connections</h2>
        <nav>
          <ul>
            {connections.map((connection) => (
              <li key={connection.connectId} className="mb-2">
                <Link
                  href={`/chat/${connection.connectId}`}
                  className="hover:bg-gray-200 p-2 rounded block"
                >
                  {connection.connectId}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
}
