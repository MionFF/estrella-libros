import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Book, UseGoogleBooksReturn } from '../features/types'
import { fetchGoogleBookById, searchGoogleBooks } from '../api/googleBooksApi'
import { normalizeDetailedBook, normalizeSearchBook } from '../utils/normalizeBook'

export const useGoogleBooks = (): UseGoogleBooksReturn => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const { t } = useTranslation('common')

  const searchBooks = useCallback(
    async (query: string, maxResults: number = 20) => {
      if (!query.trim()) return

      if (loading) {
        return
      }

      if (!navigator.onLine) {
        setError(t('common.offlineError'))
        return
      }

      setLoading(true)
      setError(null)

      const timeoutId = window.setTimeout(() => {
        setError(t('common.requestTimeout'))
        setLoading(false)
      }, 10000)

      try {
        const volumes = await searchGoogleBooks(query, maxResults)
        const formattedBooks = volumes.map(normalizeSearchBook)

        window.clearTimeout(timeoutId)

        setBooks(formattedBooks)
        setHasMore(formattedBooks.length >= maxResults)
      } catch (err) {
        window.clearTimeout(timeoutId)

        if (!navigator.onLine) {
          setError(t('common.offlineError'))
          setBooks([])
          return
        }

        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

        setError(errorMessage)
        setBooks([])
      } finally {
        setLoading(false)
      }
    },
    [loading, t],
  )

  const clearBooks = useCallback(() => {
    setBooks([])
    setError(null)
    setHasMore(true)
  }, [])

  const getBookById = useCallback(async (bookId: string): Promise<Book | null> => {
    setLoading(true)
    setError(null)

    try {
      const volume = await fetchGoogleBookById(bookId)

      if (!volume) {
        return null
      }

      return normalizeDetailedBook(volume)
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    books,
    loading,
    error,
    searchBooks,
    clearBooks,
    hasMore,
    getBookById,
  }
}
