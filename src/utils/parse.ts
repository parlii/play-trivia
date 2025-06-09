export function parseJsonResponse<T>(content: string | null | undefined): T {
  if (!content) {
    throw new Error('Empty response');
  }
  return JSON.parse(content) as T;
}
