export type Book = {
  id: string
  title: string
  authors: string[]
  description?: string
  coverUrl?: string
  publishedYear?: string
  publisher?: string
  pageCount?: number
  averageRating?: number
  ratingsCount?: number
  categories?: string[]
  language?: string
  previewLink?: string
  infoLink?: string
}

export type Books = Book[]

export type UseGoogleBooksReturn = {
  books: Book[]
  loading: boolean
  error: string | null
  searchBooks: (query: string, maxResults?: number) => Promise<void>
  clearBooks: () => void
  hasMore: boolean
}
