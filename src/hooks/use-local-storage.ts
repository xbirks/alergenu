'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 1. El estado se inicializa SIEMPRE con el valor por defecto.
  //    Esto garantiza que el render del servidor y el primer render del cliente son idénticos.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // 2. Este efecto se ejecuta SOLO en el cliente, después del montaje.
  useEffect(() => {
    try {
      // Intentamos leer del Local Storage.
      const item = window.localStorage.getItem(key);
      // Si encontramos algo, actualizamos el estado.
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      // Si hay un error, lo ignoramos y mantenemos el valor inicial.
      console.log(error);
    }
  // El array de dependencias vacío asegura que esto solo se ejecute una vez.
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Actualizamos el estado de React.
      setStoredValue(valueToStore);
      // Y lo persistimos en Local Storage (solo si estamos en el cliente).
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
