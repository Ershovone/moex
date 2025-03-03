// src/contexts/NotificationContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Notification, NotificationState } from "../types/notification";
import { NotificationDataService, AdminDataService } from "../services";

// Интерфейс для контекста
interface NotificationContextProps {
  notificationState: NotificationState;
  openNotifications: () => void;
  closeNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt" | "read">
  ) => void;
  handleNotificationClick: (notification: Notification) => void;
}

// Создаем контекст
const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

// Провайдер контекста
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notificationState, setNotificationState] = useState<NotificationState>(
    {
      notifications: [],
      unreadCount: 0,
      isOpen: false,
    }
  );

  // Загружаем уведомления при монтировании компонента
  useEffect(() => {
    const notifications = NotificationDataService.getAllNotifications();
    const unreadCount = NotificationDataService.getUnreadCount();

    setNotificationState({
      notifications,
      unreadCount,
      isOpen: false,
    });

    // Очищаем старые уведомления
    const notificationStorageDays =
      AdminDataService.getGlobalParamValue<number>("param-3", 30);
    NotificationDataService.clearOldNotifications(notificationStorageDays);
  }, []);

  const openNotifications = useCallback(() => {
    setNotificationState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const closeNotifications = useCallback(() => {
    setNotificationState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const markAsRead = useCallback((id: string) => {
    NotificationDataService.markAsRead(id);

    setNotificationState((prev) => {
      const updatedNotifications = prev.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount: NotificationDataService.getUnreadCount(),
      };
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    NotificationDataService.markAllAsRead();

    setNotificationState((prev) => {
      const updatedNotifications = prev.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount: 0,
      };
    });
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "createdAt" | "read">) => {
      const newNotification =
        NotificationDataService.addNotification(notification);

      setNotificationState((prev) => ({
        ...prev,
        notifications: [newNotification, ...prev.notifications],
        unreadCount: prev.unreadCount + 1,
      }));
    },
    []
  );

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      // Отмечаем как прочитанное
      if (!notification.read) {
        markAsRead(notification.id);
      }

      // Если есть URL, открываем его
      if (notification.url) {
        window.open(notification.url, "_blank");
      }

      // Закрываем панель уведомлений
      closeNotifications();
    },
    [markAsRead, closeNotifications]
  );

  // Имитация получения новых уведомлений (для демонстрации)
  useEffect(() => {
    const demoMessages = [
      {
        title: "Новая заявка требует согласования",
        description:
          "Заявка на закупку оборудования ожидает вашего согласования",
        type: "warning" as const,
        documentNumber: "1110045",
        system: "MPG",
        url: "#",
      },
      {
        title: "Задача выполнена",
        description: 'Задача "Подготовить отчет" была выполнена',
        type: "success" as const,
        system: "ITSM",
        url: "#",
      },
    ];

    let timeout: NodeJS.Timeout;

    const scheduleNewNotification = () => {
      const delay = Math.floor(Math.random() * (120000 - 30000 + 1)) + 30000; // От 30 сек до 2 мин

      timeout = setTimeout(() => {
        // 50% шанс получения нового уведомления
        if (Math.random() > 0.5) {
          const randomMessage =
            demoMessages[Math.floor(Math.random() * demoMessages.length)];
          addNotification(randomMessage);
        }

        scheduleNewNotification();
      }, delay);
    };

    scheduleNewNotification();

    return () => {
      clearTimeout(timeout);
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notificationState,
        openNotifications,
        closeNotifications,
        markAsRead,
        markAllAsRead,
        addNotification,
        handleNotificationClick,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Хук для использования контекста
export const useNotifications = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationContext;
