import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Book, UseGoogleBooksReturn } from '../features/types'
import { fetchGoogleBookById, searchGoogleBooks } from '../api/googleBooksApi'
import { normalizeDetailedBook, normalizeSearchBook } from '../utils/normalizeBook'

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

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

      const controller = new AbortController()
      let didTimeout = false

      setLoading(true)
      setError(null)

      const timeoutId = setTimeout(() => {
        didTimeout = true
        controller.abort()
        setError(t('common.requestTimeout'))
        setLoading(false)
      }, 10000)

      try {
        const volumes = await searchGoogleBooks(query, maxResults, controller.signal)
        const formattedBooks = volumes.map(normalizeSearchBook)

        setBooks(formattedBooks)
        setHasMore(formattedBooks.length >= maxResults)
      } catch (err) {
        if (didTimeout || isAbortError(err)) {
          return
        }

        if (!navigator.onLine) {
          setError(t('common.offlineError'))
          setBooks([])
          return
        }

        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

        setError(errorMessage)
        setBooks([])
      } finally {
        clearTimeout(timeoutId)

        if (!didTimeout) {
          setLoading(false)
        }
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
    const controller = new AbortController()
    let didTimeout = false

    setLoading(true)
    setError(null)

    const timeoutId = setTimeout(() => {
      didTimeout = true
      controller.abort()
    }, 10000)

    try {
      const volume = await fetchGoogleBookById(bookId, controller.signal)

      if (!volume) {
        return null
      }

      return normalizeDetailedBook(volume)
    } catch (err) {
      if (didTimeout || isAbortError(err)) {
        return null
      }

      return null
    } finally {
      clearTimeout(timeoutId)
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
