// src/services/data/notificationDataService.ts

import StorageService from "../storage/storageService";
import { Notification } from "../../types/notification";

const STORAGE_KEY = "moex_notifications";
const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "notification-001",
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
    id: "notification-002",
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
    id: "notification-003",
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
    id: "notification-004",
    title: "Каталог услуг был обновлен",
    description: "Обновлен список доступных услуг",
    createdAt: "2024-02-23T22:38:00",
    read: true,
    system: "Витрина услуг",
    type: "info",
  },
  {
    id: "notification-005",
    title: "В вашу группу добавлены 2 человека",
    description: 'В группу "Разработчики" добавлены 2 новых сотрудника',
    createdAt: "2024-02-02T23:58:00",
    read: true,
    system: "AD",
    type: "info",
  },
];

class NotificationDataService {
  /**
   * Инициализирует данные по уведомлениям, если они отсутствуют
   */
  static initialize(): void {
    const notifications = StorageService.get<Notification[]>(STORAGE_KEY, []);
    if (notifications.length === 0) {
      StorageService.set(STORAGE_KEY, DEFAULT_NOTIFICATIONS);
    }
  }

  /**
   * Получает все уведомления
   */
  static getAllNotifications(): Notification[] {
    return StorageService.get<Notification[]>(
      STORAGE_KEY,
      DEFAULT_NOTIFICATIONS
    );
  }

  /**
   * Получает количество непрочитанных уведомлений
   */
  static getUnreadCount(): number {
    const notifications = this.getAllNotifications();
    return notifications.filter((notification) => !notification.read).length;
  }

  /**
   * Получает непрочитанные уведомления
   */
  static getUnreadNotifications(): Notification[] {
    const notifications = this.getAllNotifications();
    return notifications.filter((notification) => !notification.read);
  }

  /**
   * Отмечает уведомление как прочитанное
   * @param notificationId - Идентификатор уведомления
   */
  static markAsRead(notificationId: string): void {
    const notifications = this.getAllNotifications();
    const notification = notifications.find((n) => n.id === notificationId);

    if (notification) {
      notification.read = true;
      StorageService.set(STORAGE_KEY, notifications);
    }
  }

  /**
   * Отмечает все уведомления как прочитанные
   */
  static markAllAsRead(): void {
    const notifications = this.getAllNotifications();

    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    StorageService.set(STORAGE_KEY, updatedNotifications);
  }

  /**
   * Добавляет новое уведомление
   * @param notification - Уведомление для добавления (без id, createdAt и read)
   */
  static addNotification(
    notification: Omit<Notification, "id" | "createdAt" | "read">
  ): Notification {
    const notifications = this.getAllNotifications();

    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    notifications.unshift(newNotification); // Добавляем в начало списка
    StorageService.set(STORAGE_KEY, notifications);

    return newNotification;
  }

  /**
   * Удаляет уведомление по ID
   * @param notificationId - Идентификатор уведомления
   */
  static deleteNotification(notificationId: string): void {
    const notifications = this.getAllNotifications();
    const filteredNotifications = notifications.filter(
      (notification) => notification.id !== notificationId
    );
    StorageService.set(STORAGE_KEY, filteredNotifications);
  }

  /**
   * Очищает прочитанные уведомления старше указанного количества дней
   * @param days - Количество дней для хранения прочитанных уведомлений
   */
  static clearOldNotifications(days: number): void {
    const notifications = this.getAllNotifications();
    const now = new Date();
    const cutoff = new Date(now.setDate(now.getDate() - days));

    const filteredNotifications = notifications.filter((notification) => {
      // Сохраняем все непрочитанные уведомления
      if (!notification.read) {
        return true;
      }

      // Проверяем дату создания для прочитанных уведомлений
      const createdAt = new Date(notification.createdAt);
      return createdAt >= cutoff;
    });

    StorageService.set(STORAGE_KEY, filteredNotifications);
  }
}

export default NotificationDataService;
