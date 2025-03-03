// src/services/data/requestDataService.ts

import StorageService from "../storage/storageService";
import { Request, RequestStatus, RequestFilters } from "../../types/request";

const STORAGE_KEY = "moex_requests";
const DEFAULT_REQUESTS: Request[] = [
  {
    id: "req-001",
    systemId: "itsm",
    systemName: "ITSM",
    authorId: "user1",
    authorName: "Иванов И.И.",
    typeId: "access",
    typeName: "Заявка на доступ",
    number: "ITSM-2024-001",
    content: "Предоставить доступ к системе документооборота",
    status: "new",
    createdAt: "2024-03-01T10:00:00",
    url: "#",
  },
  {
    id: "req-002",
    systemId: "hrsm",
    systemName: "HRSM",
    authorId: "user1",
    authorName: "Иванов И.И.",
    executorId: "user3",
    executorName: "Сидоров С.С.",
    typeId: "vacation",
    typeName: "Заявление на отпуск",
    number: "HRSM-2024-002",
    content: "Плановый отпуск с 01.03.2024 по 14.03.2024",
    status: "on_approval",
    createdAt: "2024-02-20T15:30:00",
    plannedDate: "2024-03-01T00:00:00",
    url: "#",
  },
  {
    id: "req-003",
    systemId: "mpg",
    systemName: "MPG",
    authorId: "user1",
    authorName: "Иванов И.И.",
    executorId: "user2",
    executorName: "Петров П.П.",
    typeId: "office",
    typeName: "Заказ канцтоваров",
    number: "MPG-2024-003",
    content: "Заказ степлера и скрепок",
    status: "in_progress",
    createdAt: "2024-02-25T11:15:00",
    plannedDate: "2024-03-05T00:00:00",
    url: "#",
  },
  {
    id: "req-004",
    systemId: "itsm",
    systemName: "ITSM",
    authorId: "user2",
    authorName: "Петров П.П.",
    executorId: "user3",
    executorName: "Сидоров С.С.",
    typeId: "incident",
    typeName: "Инцидент",
    number: "ITSM-2024-004",
    content: "Не работает принтер в комнате 305",
    status: "completed",
    createdAt: "2024-02-10T09:30:00",
    executionDate: "2024-02-11T14:20:00",
    url: "#",
  },
  {
    id: "req-005",
    systemId: "mpg",
    systemName: "MPG",
    authorId: "user1",
    authorName: "Иванов И.И.",
    typeId: "maintenance",
    typeName: "Заявка на ремонт",
    number: "MPG-2024-005",
    content: "Ремонт освещения в переговорной №2",
    status: "cancelled",
    createdAt: "2024-02-05T16:45:00",
    url: "#",
  },
];

class RequestDataService {
  /**
   * Инициализирует данные по заявкам, если они отсутствуют
   */
  static initialize(): void {
    const requests = StorageService.get<Request[]>(STORAGE_KEY, []);
    if (requests.length === 0) {
      StorageService.set(STORAGE_KEY, DEFAULT_REQUESTS);
    }
  }

  /**
   * Получает все заявки
   */
  static getAllRequests(): Request[] {
    return StorageService.get<Request[]>(STORAGE_KEY, DEFAULT_REQUESTS);
  }

  /**
   * Получает заявку по ID
   * @param requestId - Идентификатор заявки
   */
  static getRequestById(requestId: string): Request | undefined {
    const requests = this.getAllRequests();
    return requests.find((request) => request.id === requestId);
  }

  /**
   * Получает заявки пользователя
   * @param userId - Идентификатор пользователя
   */
  static getUserRequests(userId: string): Request[] {
    const requests = this.getAllRequests();
    return requests.filter((request) => request.authorId === userId);
  }

  /**
   * Получает заявки на согласование у пользователя
   * @param userId - Идентификатор пользователя
   */
  static getUserApprovingRequests(userId: string): Request[] {
    const requests = this.getAllRequests();
    return requests.filter(
      (request) =>
        request.executorId === userId &&
        ["new", "in_progress", "on_approval"].includes(request.status)
    );
  }

  /**
   * Фильтрует заявки по указанным критериям
   * @param filters - Фильтры для поиска заявок
   */
  static filterRequests(filters: RequestFilters): Request[] {
    let filteredRequests = this.getAllRequests();

    // Фильтр по поисковому запросу
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredRequests = filteredRequests.filter(
        (request) =>
          request.number.toLowerCase().includes(searchLower) ||
          request.content.toLowerCase().includes(searchLower) ||
          request.typeName.toLowerCase().includes(searchLower)
      );
    }

    // Фильтр по системе
    if (filters.system) {
      filteredRequests = filteredRequests.filter(
        (request) => request.systemId === filters.system
      );
    }

    // Фильтр по статусу
    if (filters.status) {
      filteredRequests = filteredRequests.filter(
        (request) => request.status === filters.status
      );
    }

    // Фильтр по дате создания (от)
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      filteredRequests = filteredRequests.filter(
        (request) => new Date(request.createdAt) >= dateFrom
      );
    }

    // Фильтр по дате создания (до)
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999); // Конец дня
      filteredRequests = filteredRequests.filter(
        (request) => new Date(request.createdAt) <= dateTo
      );
    }

    // Фильтр по ответственному
    if (filters.responsible) {
      filteredRequests = filteredRequests.filter(
        (request) =>
          request.executorId === filters.responsible ||
          (filters.responsible &&
            request.executorName
              ?.toLowerCase()
              .includes(filters.responsible.toLowerCase()))
      );
    }

    return filteredRequests;
  }

  /**
   * Сохраняет заявку
   * @param request - Заявка для сохранения
   */
  static saveRequest(request: Request): void {
    const requests = this.getAllRequests();
    const index = requests.findIndex((r) => r.id === request.id);

    if (index !== -1) {
      // Обновление существующей заявки
      requests[index] = request;
    } else {
      // Добавление новой заявки
      requests.push(request);
    }

    StorageService.set(STORAGE_KEY, requests);
  }

  /**
   * Обновляет статус заявки
   * @param requestId - Идентификатор заявки
   * @param status - Новый статус
   */
  static updateRequestStatus(requestId: string, status: RequestStatus): void {
    const requests = this.getAllRequests();
    const request = requests.find((r) => r.id === requestId);

    if (request) {
      request.status = status;

      // Обновление дат в зависимости от статуса
      if (status === "completed") {
        request.executionDate = new Date().toISOString();
      } else if (status === "closed") {
        request.closedDate = new Date().toISOString();
      }

      StorageService.set(STORAGE_KEY, requests);
    }
  }

  /**
   * Удаляет заявку по ID
   * @param requestId - Идентификатор заявки
   */
  static deleteRequest(requestId: string): void {
    const requests = this.getAllRequests();
    const filteredRequests = requests.filter(
      (request) => request.id !== requestId
    );
    StorageService.set(STORAGE_KEY, filteredRequests);
  }
}

export default RequestDataService;
