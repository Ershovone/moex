// src/utils/initializeServices.ts

import {
  ServiceDataService,
  SystemDataService,
  RequestDataService,
  TaskDataService,
  NotificationDataService,
  AdminDataService,
  UserDataService,
} from "../services";

/**
 * Инициализирует все сервисы данных при запуске приложения
 */
export const initializeServices = (): void => {
  console.log("Инициализация сервисов данных...");

  // Инициализируем все сервисы
  ServiceDataService.initialize();
  SystemDataService.initialize();
  RequestDataService.initialize();
  TaskDataService.initialize();
  NotificationDataService.initialize();
  AdminDataService.initialize();
  UserDataService.initialize();

  console.log("Все сервисы данных успешно инициализированы");

  // Выводим статистику данных для отладки
  const serviceGroups = ServiceDataService.getAllServiceGroups();
  const systems = SystemDataService.getAllSystems();
  const requests = RequestDataService.getAllRequests();
  const tasks = TaskDataService.getAllTasks();
  const notifications = NotificationDataService.getAllNotifications();
  const configItems = AdminDataService.getAllConfigItems();
  const globalParams = AdminDataService.getAllGlobalParams();
  const users = UserDataService.getAllUsers();

  console.log(`Статистика данных:
      - Групп услуг: ${serviceGroups.length}
      - Систем: ${systems.length}
      - Заявок: ${requests.length}
      - Задач: ${tasks.length}
      - Уведомлений: ${notifications.length}
      - Конфигурационных элементов: ${configItems.length}
      - Глобальных параметров: ${globalParams.length}
      - Пользователей: ${users.length}
    `);
};

export default initializeServices;
