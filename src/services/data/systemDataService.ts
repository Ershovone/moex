// src/services/data/systemDataService.ts

import StorageService from "../storage/storageService";
import { System } from "../../types/system";

const STORAGE_KEY = "moex_systems";
const DEFAULT_SYSTEMS: System[] = [
  {
    id: "itsm",
    name: "ITSM",
    description:
      "Система управления ИТ-сервисами и инцидентами. Используется для заказа ИТ-услуг и оборудования.",
    url: "#",
  },
  {
    id: "mpg",
    name: "MPG (ESM + Finance)",
    description:
      "Система управления хозяйственными услугами и финансовыми запросами компании.",
    url: "#",
  },
  {
    id: "hrsm",
    name: "HRSM",
    description:
      "Система управления кадрами и персоналом. Используется для заказа HR-услуг.",
    url: "#",
  },
  {
    id: "progress",
    name: "Progress",
    description: "Система для управления обучением и развитием персонала.",
    url: "#",
  },
  {
    id: "sed",
    name: "СЭД",
    description:
      "Система электронного документооборота для управления внутренними документами.",
    url: "#",
  },
  {
    id: "sbis",
    name: "СБИС",
    description:
      "Система для электронного документооборота с внешними контрагентами.",
    url: "#",
  },
  {
    id: "t1",
    name: "Т1 нота юнион",
    description: "Система для управления бюджетом, планирования и отчетности.",
    url: "#",
  },
  {
    id: "zup",
    name: "1С ЗУП",
    description:
      "Система учета кадров, расчета заработной платы и управления персоналом на базе 1С.",
    url: "#",
  },
];

class SystemDataService {
  /**
   * Инициализирует данные по системам, если они отсутствуют
   */
  static initialize(): void {
    const systems = StorageService.get<System[]>(STORAGE_KEY, []);
    if (systems.length === 0) {
      StorageService.set(STORAGE_KEY, DEFAULT_SYSTEMS);
    }
  }

  /**
   * Получает все системы
   */
  static getAllSystems(): System[] {
    return StorageService.get<System[]>(STORAGE_KEY, DEFAULT_SYSTEMS);
  }

  /**
   * Получает систему по ID
   * @param systemId - Идентификатор системы
   */
  static getSystemById(systemId: string): System | undefined {
    const systems = this.getAllSystems();
    return systems.find((system) => system.id === systemId);
  }

  /**
   * Получает системы по поисковому запросу
   * @param query - Поисковый запрос
   */
  static searchSystems(query: string): System[] {
    if (!query.trim()) return this.getAllSystems();

    const systems = this.getAllSystems();
    const lowercaseQuery = query.toLowerCase();

    return systems.filter(
      (system) =>
        system.name.toLowerCase().includes(lowercaseQuery) ||
        system.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Сохраняет систему
   * @param system - Система для сохранения
   */
  static saveSystem(system: System): void {
    const systems = this.getAllSystems();
    const index = systems.findIndex((s) => s.id === system.id);

    if (index !== -1) {
      // Обновление существующей системы
      systems[index] = system;
    } else {
      // Добавление новой системы
      systems.push(system);
    }

    StorageService.set(STORAGE_KEY, systems);
  }

  /**
   * Удаляет систему по ID
   * @param systemId - Идентификатор системы
   */
  static deleteSystem(systemId: string): void {
    const systems = this.getAllSystems();
    const filteredSystems = systems.filter((system) => system.id !== systemId);
    StorageService.set(STORAGE_KEY, filteredSystems);
  }
}

export default SystemDataService;
