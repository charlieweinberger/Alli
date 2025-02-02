"use client";

import { useEffect, useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Connection, User } from "@/lib/types";
import { useAuth } from "@/components/AuthProvider";

export default function ChatLayout({ children, }: { children: React.ReactNode }) {
  return (
    <ConnectionProvider>
      <div className="flex h-[calc(100vh-56px)]">
        <aside className="w-64 bg-rose-100 p-4">
          <h2 className="text-xl font-bold mb-4">Connections</h2>
          <People />
        </aside>
        <section className="flex-1">{children}</section>
      </div>
    </ConnectionProvider>
  );
}

function People() {
  const { responders } = useConnections();
  const pathName = usePathname();
  return (
    <nav>
      <ul>
        {responders.map((user: User) => (
          <li key={user.userId} className="mb-2">
            <Link
              href={`/chat/${user.userId}`}
              className={`p-2 rounded block ${
                pathName === `/chat/${user.userId}`
                  ? "bg-rose-300"
                  : "hover:bg-rose-300"
              }`}
            >
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

type ConnectionContextType = {
  connections: Connection[];
  responders: User[];
  setConnections: (connections: Connection[]) => void;
  setResponders: (responders: User[]) => void;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

export function ConnectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [responders, setResponders] = useState<User[]>([]);
  const { user } = useAuth();
  const currentUserID = user?.userId;

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch(`/api/connections/?id=${currentUserID}`);
        const data = await response.json();
        const responderIds = data.map((conn: Connection) => conn.responder);
        const responders = await Promise.all(
          responderIds.map(async (id: number) => {
            const response = await fetch(`/api/users/?id=${id}`);
            return response.json();
          })
        );
        setResponders(responders);
        setConnections(data);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    if (currentUserID) {
      fetchConnections();
    }
  }, [currentUserID]);

  return (
    <ConnectionContext.Provider
      value={{ connections, setConnections, responders, setResponders }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnections() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnections must be used within a ConnectionProvider");
  }
  return context;
}
