// src/services/data/serviceDataService.ts

import StorageService from "../storage/storageService";
import { Service, ServiceGroup } from "../../types/service";

const STORAGE_KEY = "moex_services";
const DEFAULT_SERVICES: ServiceGroup[] = [
  {
    id: "hr",
    name: "Услуги по работе с персоналом (HRSM)",
    services: [
      {
        id: "hr-1",
        name: "Заявка на подбор персонала",
        description: "Создание заявки на подбор нового сотрудника",
        system: "HRSM",
        url: "#",
        instructionUrl: "#",
        feedbackUrl: "#",
      },
      {
        id: "hr-2",
        name: "Заявка на оформление персонала",
        description: "Оформление нового сотрудника в компанию",
        system: "HRSM",
        url: "#",
        instructionUrl: "#",
      },
      {
        id: "hr-3",
        name: "Заявление на отпуск",
        description: "Оформление ежегодного отпуска",
        system: "HRSM",
        url: "#",
        instructionUrl: "#",
        popular: true,
      },
    ],
  },
  {
    id: "it",
    name: "Услуги департамента информационных технологий (ITSM)",
    services: [
      {
        id: "it-1",
        name: "Заявка на доступ к системе",
        description: "Получение доступа к информационным системам",
        system: "ITSM",
        url: "#",
        instructionUrl: "#",
        popular: true,
      },
      {
        id: "it-2",
        name: "Заявка на установку ПО",
        description: "Установка программного обеспечения на рабочую станцию",
        system: "ITSM",
        url: "#",
      },
      {
        id: "it-3",
        name: "Заявка на выдачу оборудования",
        description: "Получение рабочего оборудования (ноутбук, монитор и пр.)",
        system: "ITSM",
        url: "#",
        popular: true,
      },
    ],
  },
  {
    id: "aho",
    name: "Услуги АХО (MPG)",
    services: [
      {
        id: "aho-1",
        name: "Заказ канцтоваров",
        description: "Заказ канцелярских принадлежностей",
        system: "MPG",
        url: "#",
      },
      {
        id: "aho-2",
        name: "Заказ бумаги",
        description: "Заказ бумаги для принтеров и копировальных устройств",
        system: "MPG",
        url: "#",
        popular: true,
      },
      {
        id: "aho-3",
        name: "Заявка на перемещение рабочего места",
        description: "Перемещение рабочего места в другой кабинет",
        system: "MPG",
        url: "#",
      },
    ],
  },
];

class ServiceDataService {
  /**
   * Инициализирует данные по услугам, если они отсутствуют
   */
  static initialize(): void {
    const services = StorageService.get<ServiceGroup[]>(STORAGE_KEY, []);
    if (services.length === 0) {
      StorageService.set(STORAGE_KEY, DEFAULT_SERVICES);
    }
  }

  /**
   * Получает все группы услуг
   */
  static getAllServiceGroups(): ServiceGroup[] {
    return StorageService.get<ServiceGroup[]>(STORAGE_KEY, DEFAULT_SERVICES);
  }

  /**
   * Получает услугу по ID
   * @param serviceId - Идентификатор услуги
   */
  static getServiceById(serviceId: string): Service | null {
    const groups = this.getAllServiceGroups();

    const findServiceInGroup = (group: ServiceGroup): Service | null => {
      const service = group.services.find((s) => s.id === serviceId);
      if (service) return service;

      if (group.subgroups) {
        for (const subgroup of group.subgroups) {
          const service = findServiceInGroup(subgroup);
          if (service) return service;
        }
      }

      return null;
    };

    for (const group of groups) {
      const service = findServiceInGroup(group);
      if (service) return service;
    }

    return null;
  }

  /**
   * Получает услуги по поисковому запросу
   * @param query - Поисковый запрос
   */
  static searchServices(query: string): ServiceGroup[] {
    if (!query.trim()) return this.getAllServiceGroups();

    const groups = this.getAllServiceGroups();
    const lowercaseQuery = query.toLowerCase();

    const filterGroup = (group: ServiceGroup): ServiceGroup | null => {
      const filteredServices = group.services.filter(
        (service) =>
          service.name.toLowerCase().includes(lowercaseQuery) ||
          service.description.toLowerCase().includes(lowercaseQuery)
      );

      const filteredSubgroups: ServiceGroup[] = [];
      if (group.subgroups) {
        for (const subgroup of group.subgroups) {
          const filtered = filterGroup(subgroup);
          if (filtered) filteredSubgroups.push(filtered);
        }
      }

      if (filteredServices.length > 0 || filteredSubgroups.length > 0) {
        return {
          ...group,
          services: filteredServices,
          subgroups:
            filteredSubgroups.length > 0 ? filteredSubgroups : undefined,
        };
      }

      return null;
    };

    return groups
      .map(filterGroup)
      .filter((group): group is ServiceGroup => group !== null);
  }

  /**
   * Получает популярные услуги
   */
  static getPopularServices(): Service[] {
    const groups = this.getAllServiceGroups();
    const popularServices: Service[] = [];

    const extractPopularFromGroup = (group: ServiceGroup) => {
      group.services.forEach((service) => {
        if (service.popular) popularServices.push(service);
      });

      if (group.subgroups) {
        group.subgroups.forEach(extractPopularFromGroup);
      }
    };

    groups.forEach(extractPopularFromGroup);
    return popularServices;
  }
}

export default ServiceDataService;
