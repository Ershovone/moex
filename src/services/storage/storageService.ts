// src/services/storage/storageService.ts

/**
 * Базовый сервис для работы с localStorage
 * Предоставляет методы для сохранения и получения данных
 */
class StorageService {
  /**
   * Получает данные из localStorage по ключу
   * @param key - Ключ для получения данных
   * @param defaultValue - Значение по умолчанию
   */
  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * Сохраняет данные в localStorage
   * @param key - Ключ для сохранения данных
   * @param value - Данные для сохранения
   */
  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
    }
  }

  /**
   * Удаляет данные из localStorage по ключу
   * @param key - Ключ для удаления данных
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
    }
  }

  /**
   * Очищает все данные в localStorage
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
}

export default StorageService;
