// src/services/index.ts

// Сервисы данных
export { default as ServiceDataService } from "./data/serviceDataService";
export { default as SystemDataService } from "./data/systemDataService";
export { default as RequestDataService } from "./data/requestDataService";
export { default as TaskDataService } from "./data/taskDataService";
export { default as NotificationDataService } from "./data/notificationDataService";
export { default as AdminDataService } from "./data/adminDataService";
export { default as UserDataService } from "./data/userDataService";

// Сервис хранилища
export { default as StorageService } from "./storage/storageService";

/**
 * Инициализирует все сервисы данных
 */
export function initializeServices(): void {
  // Импортируем сервисы
  const {
    ServiceDataService,
    SystemDataService,
    RequestDataService,
    TaskDataService,
    NotificationDataService,
    AdminDataService,
    UserDataService,
  } = require("./index");

  // Инициализируем данные в каждом сервисе
  ServiceDataService.initialize();
  SystemDataService.initialize();
  RequestDataService.initialize();
  TaskDataService.initialize();
  NotificationDataService.initialize();
  AdminDataService.initialize();
  UserDataService.initialize();

  console.log("Все сервисы данных успешно инициализированы");
}
