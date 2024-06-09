import { NotificationProps } from "@/components/groups/join/add-member-button";

export type ServerResponseMessage = {
  message: string;
  status: number;
  notification?: NotificationProps;
};
