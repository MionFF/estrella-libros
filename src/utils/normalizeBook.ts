import type { Book, GoogleBooksVolume } from '../features/types'
import { cleanCategories, stripHtmlTags } from './htmlSanitizer'

function toHttpsUrl(url?: string): string | undefined {
  return url?.replace('http://', 'https://')
}

function getCoverUrl(volume: GoogleBooksVolume): string | undefined {
  const { imageLinks } = volume.volumeInfo

  return toHttpsUrl(imageLinks?.thumbnail) ?? toHttpsUrl(imageLinks?.smallThumbnail)
}

export function normalizeSearchBook(volume: GoogleBooksVolume): Book {
  const { volumeInfo } = volume

  return {
    id: volume.id,
    title: volumeInfo.title || 'No title available',
    authors: volumeInfo.authors || ['Unknown Author'],
    description: volumeInfo.description,
    coverUrl: getCoverUrl(volume),
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
}

export function normalizeDetailedBook(volume: GoogleBooksVolume): Book {
  const { volumeInfo } = volume

  return {
    id: volume.id,
    title: volumeInfo.title || 'No title available',
    authors: volumeInfo.authors || ['Unknown Author'],
    description: stripHtmlTags(volumeInfo.description || ''),
    coverUrl: getCoverUrl(volume),
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
}
