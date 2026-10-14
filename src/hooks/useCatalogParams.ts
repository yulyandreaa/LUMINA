import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filtersFromParams, sortFromParams, type SortKey } from '../lib/catalog';

/*
 * La URL es la "fuente de verdad" de filtros y orden:
 *   /monturas?forma=redonda,cat-eye&color=borgona&orden=precio-asc
 * Ventajas: se puede compartir el enlace, el botón "atrás" deshace filtros
 * y al recargar la página no se pierde nada.
 */
export type ParamKey = 'color' | 'forma' | 'talla' | 'para';

export function useCatalogParams(defaultSort: SortKey) {
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => filtersFromParams(params), [params]);
  const sort = sortFromParams(params, defaultSort);
  const query = params.get('q') ?? '';

  const update = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mutate(next);
          return next;
        },
        { replace: false },
      );
    },
    [setParams],
  );

  /** Marca o desmarca un valor dentro de un grupo multi-selección. */
  const toggle = useCallback(
    (key: ParamKey, value: string) =>
      update((next) => {
        const current = (next.get(key) ?? '').split(',').filter(Boolean);
        const values = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
        if (values.length) next.set(key, values.join(','));
        else next.delete(key);
      }),
    [update],
  );

  const setSort = useCallback(
    (value: SortKey) =>
      update((next) => {
        if (value === defaultSort) next.delete('orden');
        else next.set('orden', value);
      }),
    [update, defaultSort],
  );

  const clearAll = useCallback(
    () =>
      update((next) => {
        ['color', 'forma', 'talla', 'para'].forEach((k) => next.delete(k));
      }),
    [update],
  );

  return { filters, sort, query, toggle, setSort, clearAll };
}
