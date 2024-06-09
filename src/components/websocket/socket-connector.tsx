"use client";

import { useEffect } from "react";
import { socket } from "@/components/websocket/socket";
import { useToast } from "@/components/ui/use-toast";
import { NotificationProps } from "@/components/groups/join/add-member-button";
import { notificationAction } from "@/components/websocket/actions/socket-action";

export function SocketConnector({
  userGroupIds,
  userId,
}: {
  userGroupIds: string[];
  userId: string;
}) {
  const { toast } = useToast();

  async function handleRevalidate({ groupId }: { groupId: string }) {
    notificationAction({ groupId });
  }

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("registerUser", userId);

      userGroupIds.forEach((groupId) => {
        socket.emit("joinGroup", groupId);
      });

      socket.on("serverGroupUpdate", (update: any) => {
        handleRevalidate({ groupId: update.groupId });
      });

      socket.on("serverNotification", (notification: NotificationProps) => {
        toast({
          variant: "notification",
          title: "Notification",
          description: notification.message,
        });

        handleRevalidate({ groupId: notification.target });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
