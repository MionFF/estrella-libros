import { BASE_URL, getApiKey } from '../config/env'
import type { GoogleBooksResponse, GoogleBooksVolume } from '../features/types'

function getGoogleBooksApiKey() {
  return getApiKey()
}

export async function searchGoogleBooks(
  query: string,
  maxResults: number = 20,
): Promise<GoogleBooksVolume[]> {
  const response = await fetch(
    `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${getGoogleBooksApiKey()}`,
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = (await response.json()) as GoogleBooksResponse

  return data.items ?? []
}

export async function fetchGoogleBookById(bookId: string): Promise<GoogleBooksVolume | null> {
  let response = await fetch(`${BASE_URL}/${bookId}?key=${getGoogleBooksApiKey()}`)

  if (!response.ok) {
    response = await fetch(`${BASE_URL}/${bookId}`)
  }

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as GoogleBooksVolume

  if (!data.volumeInfo) {
    return null
  }

  return data
}
