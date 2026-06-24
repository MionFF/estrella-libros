export const bookQueryKeys = {
  all: ['books'] as const,
  searches: () => [...bookQueryKeys.all, 'search'] as const,
  search: (query: string, maxResults: number) =>
    [...bookQueryKeys.searches(), { query, maxResults }] as const,
  details: () => [...bookQueryKeys.all, 'details'] as const,
  detail: (bookId: string) => [...bookQueryKeys.details(), bookId] as const,
}
