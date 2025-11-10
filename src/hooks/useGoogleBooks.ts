import { useState, useCallback } from 'react'
import type { Book, UseGoogleBooksReturn } from '../features/types'

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

export const useGoogleBooks = (): UseGoogleBooksReturn => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const searchBooks = useCallback(async (query: string, maxResults: number = 20) => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    // Создаем таймаут сразу и инициализируем
    const timeoutId = setTimeout(() => {
      setError('Request timeout - taking longer than expected')
      setLoading(false)
    }, 7000)

    try {
      const subQueries = [query, `${query} fiction`, `${query} novel`, `${query} literature`]

      const promises = subQueries.map(async (subQuery, index) => {
        await new Promise(resolve => setTimeout(resolve, index * 200))

        const response = await fetch(
          `${BASE_URL}?q=${encodeURIComponent(subQuery)}&maxResults=10&key=${API_KEY}`,
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.items) {
          const formattedBooks: Book[] = data.items.map((item: any) => {
            const volumeInfo = item.volumeInfo
            return {
              id: item.id,
              title: volumeInfo.title || 'No title available',
              authors: volumeInfo.authors || ['Unknown Author'],
              description: volumeInfo.description,
              coverUrl:
                volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ||
                volumeInfo.imageLinks?.smallThumbnail?.replace('http://', 'https://'),
              publishedYear: volumeInfo.publishedDate?.substring(0, 4),
              publisher: volumeInfo.publisher,
              pageCount: volumeInfo.pageCount,
              averageRating: volumeInfo.averageRating,
              ratingsCount: volumeInfo.ratingsCount,
              categories: volumeInfo.categories,
              language: volumeInfo.language,
              previewLink: volumeInfo.previewLink,
              infoLink: volumeInfo.infoLink,
            }
          })
          return formattedBooks
        }
        return []
      })

      const results = await Promise.all(promises)

      // ОЧИЩАЕМ ТАЙМАУТ ПРИ УСПЕШНОЙ ЗАГРУЗКЕ
      clearTimeout(timeoutId)

      const uniqueBooks = results
        .flat()
        .filter((book, index, self) => index === self.findIndex(b => b.id === book.id))

      setBooks(uniqueBooks.slice(0, maxResults))
      setHasMore(uniqueBooks.length >= maxResults)
    } catch (err) {
      // ОЧИЩАЕМ ТАЙМАУТ ПРИ ОШИБКЕ
      clearTimeout(timeoutId)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearBooks = useCallback(() => {
    setBooks([])
    setError(null)
    setHasMore(true)
  }, [])

  return {
    books,
    loading,
    error,
    searchBooks,
    clearBooks,
    hasMore,
  }
}
