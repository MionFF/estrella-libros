import { useIds } from '../../store/favStore'
import BookCard from '../../features/components/BookCard/BookCard'
import { useGoogleBooks } from '../../hooks/useGoogleBooks'
import { useEffect, useState } from 'react'
import Loader from '../../shared/Loader/Loader'
import FavoritesHero from '../../features/components/FavoritesHero/FavoritesHero'
import type { Book } from '../../features/types'
import { useNavigate } from 'react-router-dom'

export default function FavoritesPage() {
  const favoriteIds = useIds()
  const { getBookById } = useGoogleBooks()
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Загружаем реальные данные книг
  useEffect(() => {
    const loadFavoriteBooks = async () => {
      if (favoriteIds.size === 0) {
        setFavoriteBooks([])
        return
      }

      setLoading(true)

      try {
        // 🔥 ПРОСТОЙ подход - getBookById теперь всегда возвращает Book | null
        const bookPromises = Array.from(favoriteIds).map(id => getBookById(id))
        const booksResults = await Promise.all(bookPromises)

        // Фильтруем null значения
        const validBooks = booksResults.filter((book): book is Book => book !== null)
        const failedIds = favoriteIds.size - validBooks.length

        setFavoriteBooks(validBooks)

        if (failedIds > 0) {
          console.warn(`Failed to load ${failedIds} books`)
        }
      } catch (err) {
        console.error('Unexpected error loading favorites:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFavoriteBooks()
  }, [favoriteIds, getBookById])

  if (favoriteIds.size === 0) {
    return (
      <div className='favorites-page'>
        <FavoritesHero />
        <div className='favorites-empty'>
          <div className='favorites-empty__content'>
            <div className='favorites-empty__icon'>📚</div>
            <h2>No favorites yet</h2>
            <p>Start exploring books and add them to your favorites!</p>
            <button onClick={() => navigate('/search')} className='favorites-empty__button'>
              Discover Books
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='favorites-page'>
        <FavoritesHero />
        <div className='favorites-loading'>
          <Loader />
          <p>Loading your favorite books...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='favorites-page'>
      <FavoritesHero count={favoriteBooks.length} />

      {favoriteBooks.length < favoriteIds.size && (
        <div className='favorites-warning'>
          <p>⚠️ {favoriteIds.size - favoriteBooks.length} books could not be loaded</p>
        </div>
      )}

      <div className='favorites-container'>
        {favoriteBooks.length > 0 ? (
          <div className='favorites-list'>
            {favoriteBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className='favorites-error'>
            <div className='favorites-error__content'>
              <div className='favorites-error__icon'>😔</div>
              <h3>No Books Loaded</h3>
              <p>We couldn't load any of your favorite books. This might be a temporary issue.</p>
              <button onClick={() => window.location.reload()} className='favorites-error__button'>
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
