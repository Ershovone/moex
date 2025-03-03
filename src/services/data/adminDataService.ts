// src/services/data/adminDataService.ts

import StorageService from "../storage/storageService";
import { ConfigItem, GlobalParameter, UserGroup } from "../../types/admin";

const CONFIG_ITEMS_KEY = "moex_config_items";
const GLOBAL_PARAMS_KEY = "moex_global_params";
const USER_GROUPS_KEY = "moex_user_groups";

// Моковые конфигурационные элементы
const DEFAULT_CONFIG_ITEMS: ConfigItem[] = [
  {
    id: "service-1",
    name: "Услуги по работе с персоналом (HRSM)",
    description: "Услуги HR департамента",
    published: true,
    order: 1,
    url: "#",
    type: "service",
    adminGroups: ["admin"],
    userGroups: ["users"],
  },
  {
    id: "service-2",
    name: "Услуги АХО (MPG)",
    description: "Услуги административно-хозяйственного отдела",
    published: true,
    order: 2,
    url: "#",
    type: "service",
    adminGroups: ["admin"],
    userGroups: ["users"],
  },
  {
    id: "system-1",
    name: "ITSM",
    description: "Система управления ИТ-услугами",
    published: true,
    order: 1,
    url: "#",
    type: "system",
    adminGroups: ["admin"],
    userGroups: ["users"],
  },
  {
    id: "system-2",
    name: "HRSM",
    description: "Система управления персоналом",
    published: true,
    order: 2,
    url: "#",
    type: "system",
    adminGroups: ["admin"],
    userGroups: ["users"],
  },
];

// Глобальные параметры
const DEFAULT_GLOBAL_PARAMS: GlobalParameter[] = [
  {
    id: "param-1",
    name: "Срок хранения завершённых заявок",
    description: "Количество дней хранения заявок",
    value: 90,
    type: "number",
  },
  {
    id: "param-2",
    name: "Срок хранения завершённых задач",
    description: "Количество дней хранения задач",
    value: 90,
    type: "number",
  },
  {
    id: "param-3",
    name: "Срок хранения нотификаций",
    description: "Количество дней хранения нотификаций",
    value: 30,
    type: "number",
  },
  {
    id: "param-4",
    name: "Обязательные атрибуты задач",
    description: "Атрибуты, которые должны быть заполнены",
    value: ["title", "priority"],
    type: "array",
  },
  {
    id: "param-5",
    name: "Специалисты технической поддержки",
    description: "Список пользователей с правами тех. поддержки",
    value: ["user1", "user2"],
    type: "array",
  },
  {
    id: "param-6",
    name: "Администраторы",
    description: "Пользователи с правами администратора",
    value: ["admin1", "admin2"],
    type: "array",
  },
];

// Пользовательские группы
const DEFAULT_USER_GROUPS: UserGroup[] = [
  { id: "admin", name: "Администраторы", source: "ad" },
  { id: "tech-support", name: "Техническая поддержка", source: "ad" },
  { id: "users", name: "Пользователи", source: "ad" },
  { id: "developers", name: "Разработчики", source: "ad" },
  { id: "managers", name: "Руководители", source: "ad" },
  { id: "hr", name: "HR-сотрудники", source: "ad" },
];

class AdminDataService {
  /**
   * Инициализирует данные для администрирования, если они отсутствуют
   */
  static initialize(): void {
    // Инициализация конфигурационных элементов
    const configItems = StorageService.get<ConfigItem[]>(CONFIG_ITEMS_KEY, []);
    if (configItems.length === 0) {
      StorageService.set(CONFIG_ITEMS_KEY, DEFAULT_CONFIG_ITEMS);
    }

    // Инициализация глобальных параметров
    const globalParams = StorageService.get<GlobalParameter[]>(
      GLOBAL_PARAMS_KEY,
      []
    );
    if (globalParams.length === 0) {
      StorageService.set(GLOBAL_PARAMS_KEY, DEFAULT_GLOBAL_PARAMS);
    }

    // Инициализация пользовательских групп
    const userGroups = StorageService.get<UserGroup[]>(USER_GROUPS_KEY, []);
    if (userGroups.length === 0) {
      StorageService.set(USER_GROUPS_KEY, DEFAULT_USER_GROUPS);
    }
  }

  // Методы для работы с конфигурационными элементами

  /**
   * Получает все конфигурационные элементы
   */
  static getAllConfigItems(): ConfigItem[] {
    return StorageService.get<ConfigItem[]>(
      CONFIG_ITEMS_KEY,
      DEFAULT_CONFIG_ITEMS
    );
  }

  /**
   * Получает конфигурационные элементы по типу
   * @param type - Тип конфигурационного элемента
   */
  static getConfigItemsByType(
    type: "service" | "system" | "request" | "task"
  ): ConfigItem[] {
    const items = this.getAllConfigItems();
    return items.filter((item) => item.type === type);
  }

  /**
   * Получает конфигурационный элемент по ID
   * @param itemId - Идентификатор элемента
   */
  static getConfigItemById(itemId: string): ConfigItem | undefined {
    const items = this.getAllConfigItems();
    return items.find((item) => item.id === itemId);
  }

  /**
   * Сохраняет конфигурационный элемент
   * @param item - Элемент для сохранения
   */
  static saveConfigItem(item: ConfigItem): ConfigItem {
    const items = this.getAllConfigItems();
    const index = items.findIndex((i) => i.id === item.id);

    if (index !== -1) {
      // Обновление существующего элемента
      items[index] = item;
    } else {
      // Добавление нового элемента
      items.push(item);
    }

    StorageService.set(CONFIG_ITEMS_KEY, items);
    return item;
  }

  /**
   * Удаляет конфигурационный элемент по ID
   * @param itemId - Идентификатор элемента
   */
  static deleteConfigItem(itemId: string): void {
    const items = this.getAllConfigItems();
    const filteredItems = items.filter((item) => item.id !== itemId);
    StorageService.set(CONFIG_ITEMS_KEY, filteredItems);
  }

  /**
   * Переключает публикацию элемента
   * @param itemId - Идентификатор элемента
   * @param published - Новое состояние публикации
   */
  static toggleItemPublished(itemId: string, published: boolean): void {
    const items = this.getAllConfigItems();
    const item = items.find((i) => i.id === itemId);

    if (item) {
      item.published = published;
      StorageService.set(CONFIG_ITEMS_KEY, items);
    }
  }

  // Методы для работы с глобальными параметрами

  /**
   * Получает все глобальные параметры
   */
  static getAllGlobalParams(): GlobalParameter[] {
    return StorageService.get<GlobalParameter[]>(
      GLOBAL_PARAMS_KEY,
      DEFAULT_GLOBAL_PARAMS
    );
  }

  /**
   * Получает глобальный параметр по ID
   * @param paramId - Идентификатор параметра
   */
  static getGlobalParamById(paramId: string): GlobalParameter | undefined {
    const params = this.getAllGlobalParams();
    return params.find((param) => param.id === paramId);
  }

  /**
   * Получает значение глобального параметра по ID
   * @param paramId - Идентификатор параметра
   * @param defaultValue - Значение по умолчанию
   */
  static getGlobalParamValue<T>(paramId: string, defaultValue: T): T {
    const param = this.getGlobalParamById(paramId);
    return param ? (param.value as T) : defaultValue;
  }

  /**
   * Сохраняет глобальный параметр
   * @param param - Параметр для сохранения
   */
  static saveGlobalParam(param: GlobalParameter): void {
    const params = this.getAllGlobalParams();
    const index = params.findIndex((p) => p.id === param.id);

    if (index !== -1) {
      // Обновление существующего параметра
      params[index] = param;
    } else {
      // Добавление нового параметра
      params.push(param);
    }

    StorageService.set(GLOBAL_PARAMS_KEY, params);
  }

  /**
   * Обновляет значение глобального параметра
   * @param paramId - Идентификатор параметра
   * @param value - Новое значение
   */
  static updateGlobalParamValue(paramId: string, value: any): void {
    const params = this.getAllGlobalParams();
    const param = params.find((p) => p.id === paramId);

    if (param) {
      param.value = value;
      StorageService.set(GLOBAL_PARAMS_KEY, params);
    }
  }

  /**
   * Обновляет все глобальные параметры
   * @param params - Массив параметров
   */
  static updateGlobalParams(params: GlobalParameter[]): void {
    StorageService.set(GLOBAL_PARAMS_KEY, params);
  }

  // Методы для работы с пользовательскими группами

  /**
   * Получает все пользовательские группы
   */
  static getAllUserGroups(): UserGroup[] {
    return StorageService.get<UserGroup[]>(
      USER_GROUPS_KEY,
      DEFAULT_USER_GROUPS
    );
  }

  /**
   * Получает пользовательскую группу по ID
   * @param groupId - Идентификатор группы
   */
  static getUserGroupById(groupId: string): UserGroup | undefined {
    const groups = this.getAllUserGroups();
    return groups.find((group) => group.id === groupId);
  }

  /**
   * Сохраняет пользовательскую группу
   * @param group - Группа для сохранения
   */
  static saveUserGroup(group: UserGroup): void {
    const groups = this.getAllUserGroups();
    const index = groups.findIndex((g) => g.id === group.id);

    if (index !== -1) {
      // Обновление существующей группы
      groups[index] = group;
    } else {
      // Добавление новой группы
      groups.push(group);
    }

    StorageService.set(USER_GROUPS_KEY, groups);
  }

  /**
   * Удаляет пользовательскую группу по ID
   * @param groupId - Идентификатор группы
   */
  static deleteUserGroup(groupId: string): void {
    const groups = this.getAllUserGroups();
    const filteredGroups = groups.filter((group) => group.id !== groupId);
    StorageService.set(USER_GROUPS_KEY, filteredGroups);
  }

  /**
   * Добавляет пользователя в группу
   * @param groupId - Идентификатор группы
   * @param userId - Идентификатор пользователя
   */
  static addUserToGroup(groupId: string, userId: string): void {
    const groups = this.getAllUserGroups();
    const group = groups.find((g) => g.id === groupId);

    if (group) {
      if (!group.members) {
        group.members = [];
      }

      if (!group.members.includes(userId)) {
        group.members.push(userId);
        StorageService.set(USER_GROUPS_KEY, groups);
      }
    }
  }

  /**
   * Удаляет пользователя из группы
   * @param groupId - Идентификатор группы
   * @param userId - Идентификатор пользователя
   */
  static removeUserFromGroup(groupId: string, userId: string): void {
    const groups = this.getAllUserGroups();
    const group = groups.find((g) => g.id === groupId);

    if (group && group.members) {
      group.members = group.members.filter((id) => id !== userId);
      StorageService.set(USER_GROUPS_KEY, groups);
    }
  }

  /**
   * Проверяет, является ли пользователь администратором
   * @param userId - Идентификатор пользователя
   */
  static isAdmin(userId: string): boolean {
    const adminParamId = "param-6"; // ID параметра с администраторами
    const adminUsers = this.getGlobalParamValue<string[]>(adminParamId, []);
    return adminUsers.includes(userId);
  }

  /**
   * Проверяет, является ли пользователь специалистом технической поддержки
   * @param userId - Идентификатор пользователя
   */
  static isSupportSpecialist(userId: string): boolean {
    const supportParamId = "param-5"; // ID параметра со специалистами поддержки
    const supportUsers = this.getGlobalParamValue<string[]>(supportParamId, []);
    return supportUsers.includes(userId);
  }
}

export default AdminDataService;
