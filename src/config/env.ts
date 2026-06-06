export const getApiKey = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_BOOKS_API_KEY) {
    return import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
  }

  if (typeof process !== 'undefined' && process.env?.VITE_GOOGLE_BOOKS_API_KEY) {
    return process.env.VITE_GOOGLE_BOOKS_API_KEY
  }

  throw new Error('VITE_GOOGLE_BOOKS_API_KEY is not defined.')
}

export const BASE_URL = 'https://www.googleapis.com/books/v1/volumes'
