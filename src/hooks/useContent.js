import { useMemo, useSyncExternalStore } from 'react';
import { subscribe, getVersion, getState, isLoading } from '../services/contentService';

// Lee una o varias secciones. Devuelve { data: {sección: contenido}, loading, isFallback }.
// Se vuelve a renderizar cuando cambia el contenido (carga inicial o edición del admin).
export function useContent(...sections) {
  const version = useSyncExternalStore(subscribe, getVersion);
  const key = sections.join('|');

  return useMemo(() => {
    const state = getState();
    const data = {};
    sections.forEach((s) => { data[s] = state[s] ?? null; });
    return { data, isFallback: sections.some((s) => state[s]?._demo), loading: isLoading() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);
}
