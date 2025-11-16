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
      setError('Request timeout')
      setLoading(false)
    }, 10000)

    try {
      // 🔥 ВРЕМЕННО: ТОЛЬКО ОДИН ЗАПРОС вместо 4!
      const response = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      clearTimeout(timeoutId)

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

        setBooks(formattedBooks)
        setHasMore(formattedBooks.length >= maxResults)
      } else {
        setBooks([])
        setHasMore(false)
      }
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

  const getBookById = useCallback(async (bookId: string): Promise<Book | null> => {
    try {
      let response = await fetch(`${BASE_URL}/${bookId}?key=${API_KEY}`)

      if (!response.ok) {
        console.warn(`First attempt failed for ${bookId}, trying without API key...`)
        response = await fetch(`${BASE_URL}/${bookId}`)
      }

      if (!response.ok) {
        console.warn(`Book ${bookId} not found: ${response.status}`)
        return null
      }

      const data = await response.json()

      if (!data.volumeInfo) {
        console.warn(`No volumeInfo for book ${bookId}`)
        return null
      }

      const volumeInfo = data.volumeInfo
      return {
        id: data.id,
        title: volumeInfo.title || 'No title available',
        authors: volumeInfo.authors || ['Unknown Author'],
        description: stripHtmlTags(volumeInfo.description || ''),
        coverUrl:
          volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ||
          volumeInfo.imageLinks?.smallThumbnail?.replace('http://', 'https://'),
        publishedYear: volumeInfo.publishedDate?.substring(0, 4),
        publisher: volumeInfo.publisher,
        pageCount: volumeInfo.pageCount,
        averageRating: volumeInfo.averageRating,
        ratingsCount: volumeInfo.ratingsCount,
        categories: cleanCategories(volumeInfo.categories),
        language: volumeInfo.language,
        previewLink: volumeInfo.previewLink,
        infoLink: volumeInfo.infoLink,
      }
    } catch (err) {
      console.warn(`Network error for book ${bookId}:`, err)
      return null
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
