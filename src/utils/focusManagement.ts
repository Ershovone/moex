// src/utils/focusManagement.ts

/**
 * Этот модуль помогает управлять отображением фокуса в зависимости от
 * способа навигации (мышь или клавиатура)
 */

export const setupFocusManagement = (): void => {
  // Добавляем класс к body при использовании клавиатуры
  const handleKeyDown = (e: KeyboardEvent) => {
    // Проверяем, что используется клавиша навигации (Tab)
    if (e.key === "Tab") {
      document.body.classList.add("using-keyboard");
    }
  };

  // Удаляем класс при использовании мыши
  const handleMouseDown = () => {
    document.body.classList.remove("using-keyboard");
  };

  // Добавляем обработчики событий
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("mousedown", handleMouseDown);

  // Добавляем стили для управления фокусом
  const styleElement = document.createElement("style");
  styleElement.textContent = `
      body:not(.using-keyboard) *:focus {
        outline: none !important;
        box-shadow: none !important;
      }
    `;
  document.head.appendChild(styleElement);
};

export default setupFocusManagement;
