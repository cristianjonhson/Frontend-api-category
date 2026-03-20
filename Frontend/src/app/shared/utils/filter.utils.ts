/**
 * Normaliza un término de búsqueda para comparaciones de filtrado.
 * Convierte a minúsculas, elimina espacios extremos y garantiza string vacío
 * como resultado cuando el valor de entrada no es utilizable.
 */
export function normalizeFilterTerm(term: string): string {
  return (term ?? '').toString().toLowerCase().trim();
}
