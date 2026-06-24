import { BASE_URL, getApiKey } from '../config/env'
import type { GoogleBooksResponse, GoogleBooksVolume } from '../features/types'

function getGoogleBooksApiKey() {
  return getApiKey()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isGoogleBooksVolume(value: unknown): value is GoogleBooksVolume {
  return isRecord(value) && typeof value.id === 'string' && isRecord(value.volumeInfo)
}

function isGoogleBooksResponse(value: unknown): value is GoogleBooksResponse {
  return (
    isRecord(value) &&
    (!('items' in value) || (Array.isArray(value.items) && value.items.every(isGoogleBooksVolume)))
  )
}

export async function searchGoogleBooks(
  query: string,
  maxResults: number = 20,
  signal?: AbortSignal,
): Promise<GoogleBooksVolume[]> {
  const response = await fetch(
    `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${getGoogleBooksApiKey()}`,
    { signal },
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: unknown = await response.json()

  if (!isGoogleBooksResponse(data)) {
    throw new Error('Invalid Google Books search response')
  }

  return data.items ?? []
}

export async function fetchGoogleBookById(
  bookId: string,
  signal?: AbortSignal,
): Promise<GoogleBooksVolume | null> {
  let response = await fetch(`${BASE_URL}/${bookId}?key=${getGoogleBooksApiKey()}`, { signal })

  if (!response.ok) {
    response = await fetch(`${BASE_URL}/${bookId}`, { signal })
  }

  if (!response.ok) {
    return null
  }

  const data: unknown = await response.json()

  if (!isGoogleBooksVolume(data)) {
    return null
  }

  return data
}
