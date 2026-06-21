import { useQuery } from '@tanstack/react-query'
import { fetchGoogleBookById, searchGoogleBooks } from '../../api/googleBooksApi'
import { normalizeDetailedBook, normalizeSearchBook } from '../../utils/normalizeBook'
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

const DETAILS_STALE_TIME = 10 * 60 * 1000

export function useBookDetailsQuery(bookId: string, enabled = true) {
  return useQuery({
    queryKey: bookQueryKeys.detail(bookId),
    queryFn: async ({ signal }) => {
      const volume = await fetchGoogleBookById(bookId, signal)

      if (!volume) {
        throw new Error('Book details not found')
      }

      return normalizeDetailedBook(volume)
    },
    enabled: enabled && Boolean(bookId),
    staleTime: DETAILS_STALE_TIME,
    retry: 1,
  })
}
