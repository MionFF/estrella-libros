import { useQuery } from '@tanstack/react-query'
import { searchGoogleBooks } from '../../api/googleBooksApi'
import { normalizeSearchBook } from '../../utils/normalizeBook'
import { bookQueryKeys } from './bookQueryKeys'

const SEARCH_STALE_TIME = 5 * 60 * 1000

export function useBooksSearchQuery(query: string, maxResults = 20) {
  const trimmedQuery = query.trim()

  return useQuery({
    queryKey: bookQueryKeys.search(trimmedQuery, maxResults),
    queryFn: async ({ signal }) => {
      const volumes = await searchGoogleBooks(trimmedQuery, maxResults, signal)

      return volumes.map(normalizeSearchBook)
    },
    enabled: Boolean(trimmedQuery),
    staleTime: SEARCH_STALE_TIME,
    retry: 1,
  })
}
