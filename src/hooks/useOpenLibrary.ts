import { useState } from 'react'
import { type Book } from '../features/types'

export const useOpenLibrary = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchBooks = async (query: string, limit: number = 20) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`,
      )

      if (!response.ok) throw new Error('Failed to fetch books')

      const data = await response.json()

      // ТОЛЬКО базовые данные, БЕЗ дополнительных запросов
      const formattedBooks: Book[] = data.docs.map((book: any) => ({
        id: book.key,
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        publishYear: book.first_publish_year,
        coverUrl: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : '/book-placeholder.jpg',
      }))

      setBooks(formattedBooks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return { books, loading, error, searchBooks }
}
