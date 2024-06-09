"use client";

import { useEffect } from "react";
import { socket } from "./socket";
import { useToast } from "../ui/use-toast";
import { NotificationProps } from "../groups/join/add-member-button";
import { ToastAction } from "../ui/toast";
import { notificationAction } from "./actions/socket-action";

export function SocketConnector() {
  const { toast } = useToast();

  async function handleRevalidate({ groupId }: { groupId: string }) {
    notificationAction({ groupId });
  }

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.on("serverNotification", (notification: NotificationProps) => {
        console.log("Notification received", notification);
        toast({
          title: "Notification",
          description: notification.message,
          action: (
            <ToastAction
              onClick={() => handleRevalidate({ groupId: notification.target })}
              altText='Click ok to update group page'>
              Ok
            </ToastAction>
          ),
        });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
