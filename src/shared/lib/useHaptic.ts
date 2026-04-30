import { useCallback } from 'react';

export const useHapticMenu = () => {
  const hapticMenuOpen = useCallback(() => {
    if (!('ontouchstart' in window)) return;

    // Правильная структура: label содержит input!
    const labelEl = document.createElement('label');
    labelEl.setAttribute('aria-hidden', 'true');
    labelEl.style.display = 'none';  // Скрыто полностью

    const inputEl = document.createElement('input');
    inputEl.type = 'checkbox';
    inputEl.setAttribute('switch', '');
    labelEl.appendChild(inputEl);  // input ВНУТРИ label!

    document.head.appendChild(labelEl);  // head лучше body
    labelEl.click();  // Создаётся/кликается/удаляется за 1 кадр
    document.head.removeChild(labelEl);
  }, []);

  return hapticMenuOpen;
};