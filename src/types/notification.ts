// src/types/notification.ts

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  url?: string;
  documentNumber?: string;
  system?: string;
  type: "info" | "warning" | "success" | "error";
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
}
