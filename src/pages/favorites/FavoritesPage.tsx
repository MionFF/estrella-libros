import { useIds } from '../../store/favStore'
import BookCard from '../../features/components/BookCard/BookCard'
import { useGoogleBooks } from '../../hooks/useGoogleBooks'
import { useEffect, useState } from 'react'
import Loader from '../../shared/Loader/Loader'
import FavoritesHero from '../../features/components/FavoritesHero/FavoritesHero'
import type { Book } from '../../features/types'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function FavoritesPage() {
  const favoriteIds = useIds()
  const { getBookById } = useGoogleBooks()
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const heroTitle = `⭐ ${t('favorites.hero.title')}`
  const heroSubtitle = t('favorites.hero.subtitle')

  useEffect(() => {
    const loadFavoriteBooks = async () => {
      if (favoriteIds.size === 0) {
        setFavoriteBooks([])
        return
      }

      setLoading(true)

      try {
        const bookPromises = Array.from(favoriteIds).map(id => getBookById(id))
        const booksResults = await Promise.all(bookPromises)

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
        <FavoritesHero title={heroTitle} subtitle={heroSubtitle} />
        <div className='favorites-empty'>
          <div className='favorites-empty__content'>
            <div className='favorites-empty__icon'>📚</div>
            <h2>{t('favorites.emptyTitle')}</h2>
            <p>{t('favorites.emptySubtitle')}</p>
            <button onClick={() => navigate('/search')} className='favorites-empty__button'>
              {t('search.searchButton')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='favorites-page'>
        <FavoritesHero title={heroTitle} subtitle={heroSubtitle} />
        <div className='favorites-loading'>
          <Loader />
          <p>{t('favorites.loadingLabel')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='favorites-page'>
      <FavoritesHero title={heroTitle} subtitle={heroSubtitle} count={favoriteBooks.length} />

      {favoriteBooks.length < favoriteIds.size && (
        <div className='favorites-warning'>
          <p>
            ⚠️ {favoriteIds.size - favoriteBooks.length} {t('favorites.warningLabel')}
          </p>
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
              <h3>{t('favorites.errorTitle')}</h3>
              <p>{t('favorites.errorSubtitle')}</p>
              <button onClick={() => window.location.reload()} className='favorites-error__button'>
                {t('common.tryAgain')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
