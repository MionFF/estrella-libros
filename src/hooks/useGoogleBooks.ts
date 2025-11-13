import { useState, useCallback } from 'react'
import type { Book, UseGoogleBooksReturn } from '../features/types'
import { cleanCategories, stripHtmlTags } from '../utils/htmlSanitizer'

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
      clearTimeout(timeoutId)

      const uniqueBooks = results
        .flat()
        .filter((book, index, self) => index === self.findIndex(b => b.id === book.id))

      setBooks(uniqueBooks.slice(0, maxResults))
      setHasMore(uniqueBooks.length >= maxResults)
    } catch (err) {
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

  // 🔥 ПОЛНОСТЬЮ ПЕРЕПИСАННЫЙ getBookById - НИКОГДА не бросает ошибки
  const getBookById = useCallback(async (bookId: string): Promise<Book | null> => {
    try {
      // Пробуем с API ключом
      let response = await fetch(`${BASE_URL}/${bookId}?key=${API_KEY}`)

      // Если 503 или другая ошибка, пробуем без ключа
      if (!response.ok) {
        console.warn(`First attempt failed for ${bookId}, trying without API key...`)
        response = await fetch(`${BASE_URL}/${bookId}`)
      }

      // Если всё равно ошибка - просто возвращаем null
      if (!response.ok) {
        console.warn(`Book ${bookId} not found: ${response.status}`)
        return null
      }

      const data = await response.json()

      // Если нет данных книги - возвращаем null
      if (!data.volumeInfo) {
        console.warn(`No volumeInfo for book ${bookId}`)
        return null
      }

      return formatBookData(data)
    } catch (err) {
      // 🔥 ВАЖНО: Ловим ВСЕ ошибки и возвращаем null вместо throw
      console.warn(`Network error for book ${bookId}:`, err)
      return null
    }
  }, [])

  return {
    books,
    loading, // loading относится только к searchBooks
    error, // error относится только к searchBooks
    searchBooks,
    clearBooks,
    hasMore,
    getBookById,
  }
}

// Вспомогательная функция для форматирования книги
function formatBookData(data: any): Book {
  const volumeInfo = data.volumeInfo

  return {
    id: data.id,
    title: volumeInfo.title || 'No title available',
    authors: volumeInfo.authors || ['Unknown Author'],
    description: stripHtmlTags(volumeInfo.description || ''), // ← ОЧИЩАЕМ описание
    coverUrl:
      volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ||
      volumeInfo.imageLinks?.smallThumbnail?.replace('http://', 'https://'),
    publishedYear: volumeInfo.publishedDate?.substring(0, 4),
    publisher: volumeInfo.publisher,
    pageCount: volumeInfo.pageCount,
    averageRating: volumeInfo.averageRating,
    ratingsCount: volumeInfo.ratingsCount,
    categories: cleanCategories(volumeInfo.categories), // ← ОЧИЩАЕМ категории
    language: volumeInfo.language,
    previewLink: volumeInfo.previewLink,
    infoLink: volumeInfo.infoLink,
  }
}
