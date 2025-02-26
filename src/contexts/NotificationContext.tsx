// src/contexts/NotificationContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Notification, NotificationState } from "../types/notification";

// Пример данных для нотификаций
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Заявка №1110037 была успешно выполнена",
    description: "Заявка на обучение успешно завершена",
    createdAt: "2024-02-26T10:15:00",
    read: false,
    documentNumber: "1110037",
    system: "HRSM",
    type: "success",
    url: "#",
  },
  {
    id: "2",
    title: "Заявка №1110025 на перенос отпуска согласована",
    description: "Заявка согласована руководителем",
    createdAt: "2024-02-26T10:17:00",
    read: false,
    documentNumber: "1110025",
    system: "HRSM",
    type: "info",
    url: "#",
  },
  {
    id: "3",
    title: "Заявка №1110010 по перенос отпуска требует согласования",
    description: "Новая заявка ожидает вашего согласования",
    createdAt: "2024-02-26T10:10:00",
    read: true,
    documentNumber: "1110010",
    system: "HRSM",
    type: "warning",
    url: "#",
  },
  {
    id: "4",
    title: "Каталог услуг был обновлен",
    description: "Обновлен список доступных услуг",
    createdAt: "2024-02-23T22:38:00",
    read: true,
    system: "Витрина услуг",
    type: "info",
  },
  {
    id: "5",
    title: "В вашу группу добавлены 2 человека",
    description: 'В группу "Разработчики" добавлены 2 новых сотрудника',
    createdAt: "2024-02-02T23:58:00",
    read: true,
    system: "AD",
    type: "info",
  },
];

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
      notifications: MOCK_NOTIFICATIONS,
      unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
      isOpen: false,
    }
  );

  const openNotifications = useCallback(() => {
    setNotificationState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const closeNotifications = useCallback(() => {
    setNotificationState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotificationState((prev) => {
      const updatedNotifications = prev.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );

      return {
        ...prev,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      };
    });
  }, []);

  const markAllAsRead = useCallback(() => {
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
      const newNotification: Notification = {
        ...notification,
        id: `notification-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      };

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

  // Имитация получения новых уведомлений
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
