// src/services/data/userDataService.ts

import StorageService from "../storage/storageService";
import { User } from "../../types/support";

const USERS_KEY = "moex_users";
const CURRENT_USER_KEY = "moex_current_user";

const DEFAULT_USERS: User[] = [
  {
    id: "user1",
    fullName: "Иванов Иван Иванович",
    email: "ivanov@example.com",
    department: "Отдел разработки",
    position: "Старший разработчик",
  },
  {
    id: "user2",
    fullName: "Петров Петр Петрович",
    email: "petrov@example.com",
    department: "Отдел тестирования",
    position: "Тестировщик",
  },
  {
    id: "user3",
    fullName: "Сидорова Анна Владимировна",
    email: "sidorova@example.com",
    department: "Отдел маркетинга",
    position: "Маркетолог",
  },
  {
    id: "user4",
    fullName: "Козлов Дмитрий Сергеевич",
    email: "kozlov@example.com",
    department: "Отдел продаж",
    position: "Менеджер по продажам",
  },
  {
    id: "user5",
    fullName: "Смирнова Елена Александровна",
    email: "smirnova@example.com",
    department: "Бухгалтерия",
    position: "Главный бухгалтер",
  },
];

// Текущий пользователь по умолчанию
const DEFAULT_CURRENT_USER: User = DEFAULT_USERS[0];

class UserDataService {
  /**
   * Инициализирует данные по пользователям, если они отсутствуют
   */
  static initialize(): void {
    const users = StorageService.get<User[]>(USERS_KEY, []);
    if (users.length === 0) {
      StorageService.set(USERS_KEY, DEFAULT_USERS);
    }

    const currentUser = StorageService.get<User | null>(CURRENT_USER_KEY, null);
    if (!currentUser) {
      StorageService.set(CURRENT_USER_KEY, DEFAULT_CURRENT_USER);
    }
  }

  /**
   * Получает всех пользователей
   */
  static getAllUsers(): User[] {
    return StorageService.get<User[]>(USERS_KEY, DEFAULT_USERS);
  }

  /**
   * Получает пользователя по ID
   * @param userId - Идентификатор пользователя
   */
  static getUserById(userId: string): User | undefined {
    const users = this.getAllUsers();
    return users.find((user) => user.id === userId);
  }

  /**
   * Поиск пользователей по поисковому запросу
   * @param query - Поисковый запрос
   */
  static searchUsers(query: string): User[] {
    if (!query.trim()) return [];

    const users = this.getAllUsers();
    const lowercaseQuery = query.toLowerCase();

    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.department.toLowerCase().includes(lowercaseQuery) ||
        user.position.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Получает текущего пользователя
   */
  static getCurrentUser(): User {
    return StorageService.get<User>(CURRENT_USER_KEY, DEFAULT_CURRENT_USER);
  }

  /**
   * Устанавливает текущего пользователя
   * @param user - Пользователь
   */
  static setCurrentUser(user: User): void {
    StorageService.set(CURRENT_USER_KEY, user);
  }

  /**
   * Сохраняет пользователя
   * @param user - Пользователь для сохранения
   */
  static saveUser(user: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      // Обновление существующего пользователя
      users[index] = user;
    } else {
      // Добавление нового пользователя
      users.push(user);
    }

    StorageService.set(USERS_KEY, users);
  }

  /**
   * Удаляет пользователя по ID
   * @param userId - Идентификатор пользователя
   */
  static deleteUser(userId: string): void {
    const users = this.getAllUsers();
    const filteredUsers = users.filter((user) => user.id !== userId);
    StorageService.set(USERS_KEY, filteredUsers);
  }
}

export default UserDataService;
