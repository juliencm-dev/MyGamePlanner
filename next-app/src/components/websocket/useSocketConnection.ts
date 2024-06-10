import { useEffect } from "react";
import { socket } from "@/components/websocket/socket";

export function useSocketConnection() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {});

    return () => {
      socket.disconnect();
    };
  }, []);
}
