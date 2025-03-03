// src/services/data/taskDataService.ts

import StorageService from "../storage/storageService";
import { Task, TasksFilters } from "../../types/task";

const STORAGE_KEY = "moex_tasks";
const DEFAULT_TASKS: Task[] = [
  {
    id: "task-001",
    number: "TASK-2024-001",
    title: "Заказать подарки детям сотрудников на НГ",
    description:
      "Необходимо заказать новогодние подарки для детей сотрудников. Составить список, согласовать бюджет и оформить заказ.",
    assignee: "Иванов И.И.",
    author: "Петров П.П.",
    priority: "high",
    category: "Заказ подарков",
    createdAt: "2024-02-20T10:00:00",
    dueDate: "2024-03-01T00:00:00",
    status: "active",
    daysLeft: 5,
    source: "ITSM",
    url: "#",
  },
  {
    id: "task-002",
    number: "TASK-2024-002",
    title: "Оставить отзыв на перевод техники",
    description:
      "Требуется оставить отзыв о качестве перевода техники из одного кабинета в другой.",
    assignee: "Иванов И.И.",
    author: "Сидоров С.С.",
    priority: "medium",
    category: "Оставить отзыв",
    createdAt: "2024-02-18T10:00:00",
    dueDate: "2024-02-25T00:00:00",
    completedDate: "2024-02-24T00:00:00",
    status: "completed",
    source: "MPG",
    url: "#",
  },
  {
    id: "task-003",
    number: "TASK-2024-003",
    title: "Инструктаж по ТБ",
    description:
      "Необходимо пройти ежегодный инструктаж по технике безопасности.",
    assignee: "Иванов И.И.",
    author: "Система",
    priority: "medium",
    category: "Инструктаж",
    createdAt: "2024-02-15T10:00:00",
    dueDate: "2024-02-20T00:00:00",
    status: "overdue",
    daysLeft: -5,
    source: "Progress",
    url: "#",
  },
  {
    id: "task-004",
    number: "TASK-2024-004",
    title: "Согласовать отпуск Петрова К.Б.",
    description:
      "Требуется согласовать заявление на отпуск сотрудника Петрова К.Б.",
    assignee: "Иванов И.И.",
    author: "Система",
    priority: "low",
    category: "Согласование",
    createdAt: "2024-02-25T09:15:00",
    dueDate: "2024-03-05T00:00:00",
    status: "active",
    daysLeft: 8,
    source: "HRSM",
    url: "#",
  },
  {
    id: "task-005",
    number: "TASK-2024-005",
    title: "Подготовить презентацию для совещания",
    description:
      "Подготовить презентацию о результатах работы отдела за первый квартал.",
    assignee: "Иванов И.И.",
    author: "Петров П.П.",
    priority: "urgent",
    category: "Документы",
    createdAt: "2024-02-28T11:30:00",
    dueDate: "2024-03-02T00:00:00",
    status: "active",
    daysLeft: 2,
    url: "#",
  },
];

class TaskDataService {
  /**
   * Инициализирует данные по задачам, если они отсутствуют
   */
  static initialize(): void {
    const tasks = StorageService.get<Task[]>(STORAGE_KEY, []);
    console.log("Initializing TaskDataService, found tasks:", tasks.length);

    if (tasks.length === 0) {
      console.log("No tasks found, setting default tasks");
      StorageService.set(STORAGE_KEY, DEFAULT_TASKS);
    }

    // Обновляем daysLeft для существующих задач
    this.updateDaysLeft();
  }

  /**
   * Получает все задачи
   */
  static getAllTasks(): Task[] {
    return StorageService.get<Task[]>(STORAGE_KEY, DEFAULT_TASKS);
  }

  /**
   * Получает задачу по ID
   * @param taskId - Идентификатор задачи
   */
  static getTaskById(taskId: string): Task | undefined {
    const tasks = this.getAllTasks();
    return tasks.find((task) => task.id === taskId);
  }

  /**
   * Обновляет состояние daysLeft для всех задач
   * Вызывается при загрузке списка задач для актуализации оставшихся дней
   */
  static updateDaysLeft(): void {
    const tasks = this.getAllTasks();
    const today = new Date();

    const updatedTasks = tasks.map((task) => {
      if (task.status === "completed" || !task.dueDate) {
        return task;
      }

      const dueDate = new Date(task.dueDate);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Обновляем статус, если задача просрочена
      if (diffDays < 0 && task.status === "active") {
        task.status = "overdue";
      }

      return {
        ...task,
        daysLeft: diffDays,
      };
    });

    StorageService.set(STORAGE_KEY, updatedTasks);
  }

  /**
   * Фильтрует задачи по указанным критериям
   * @param filters - Фильтры для поиска задач
   */
  static filterTasks(filters: TasksFilters): Task[] {
    let filteredTasks = this.getAllTasks();

    // Фильтр по поисковому запросу
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.number.toLowerCase().includes(searchLower)
      );
    }

    // Фильтр по статусу
    if (filters.status) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filters.status
      );
    }

    // Фильтр по приоритету
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === filters.priority
      );
    }

    return filteredTasks;
  }

  /**
   * Получает активные задачи (не завершенные)
   */
  static getActiveTasks(): Task[] {
    const tasks = this.getAllTasks();
    return tasks.filter((task) => task.status === "active");
  }

  /**
   * Получает просроченные задачи
   */
  static getOverdueTasks(): Task[] {
    const tasks = this.getAllTasks();
    return tasks.filter((task) => task.status === "overdue");
  }

  /**
   * Получает завершенные задачи
   */
  static getCompletedTasks(): Task[] {
    const tasks = this.getAllTasks();
    return tasks.filter((task) => task.status === "completed");
  }

  /**
   * Сохраняет задачу
   * @param task - Задача для сохранения
   */
  // Обновленная версия метода saveTask в src/services/data/taskDataService.ts
  static saveTask(task: Task): Task {
    // Получаем текущие задачи из localStorage
    const tasks = this.getAllTasks();
    const index = tasks.findIndex((t) => t.id === task.id);

    // Добавляем обязательные поля для новой задачи
    if (!task.id) {
      task.id = `task-${Date.now()}`;
    }
    if (!task.number) {
      task.number = `TASK-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;
    }
    if (!task.createdAt) {
      task.createdAt = new Date().toISOString();
    }

    // Рассчитываем daysLeft, если указана дата завершения
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      task.daysLeft = diffDays;
    }

    // Определяем статус, если задача просрочена
    if (
      task.daysLeft !== undefined &&
      task.daysLeft < 0 &&
      task.status === "active"
    ) {
      task.status = "overdue";
    }

    if (index !== -1) {
      // Обновление существующей задачи
      tasks[index] = task;
    } else {
      // Добавление новой задачи
      tasks.push(task);
    }

    // Важно: сохраняем обновленный массив задач в localStorage
    StorageService.set(STORAGE_KEY, tasks);

    // Для отладки - выводим в консоль
    console.log("Saved tasks:", tasks);

    return task;
  }

  /**
   * Завершает задачу
   * @param taskId - Идентификатор задачи
   */
  static completeTask(taskId: string): void {
    const tasks = this.getAllTasks();
    const task = tasks.find((t) => t.id === taskId);

    if (task) {
      task.status = "completed";
      task.completedDate = new Date().toISOString();
      StorageService.set(STORAGE_KEY, tasks);
    }
  }

  /**
   * Удаляет задачу по ID
   * @param taskId - Идентификатор задачи
   */
  static deleteTask(taskId: string): void {
    const tasks = this.getAllTasks();
    const filteredTasks = tasks.filter((task) => task.id !== taskId);
    StorageService.set(STORAGE_KEY, filteredTasks);
  }
}

export default TaskDataService;
