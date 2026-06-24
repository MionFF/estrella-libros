import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useIds } from '../../store/favStore'
import BookCard from '../../features/components/BookCard/BookCard'
import { useFavoriteBooksQueries } from '../../features/books/bookQueries'
import Loader from '../../shared/Loader/Loader'
import FavoritesHero from '../../features/components/FavoritesHero/FavoritesHero'

export default function FavoritesPage() {
  const favoriteIds = useIds()
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const favoriteBookIds = useMemo(() => Array.from(favoriteIds), [favoriteIds])
  const favoriteBookQueries = useFavoriteBooksQueries(favoriteBookIds)

  const favoriteBooks = favoriteBookQueries
    .map(query => query.data)
    .filter(book => book !== undefined)

  const loading = favoriteBookQueries.some(query => query.isLoading || query.isFetching)

  const failedBooksCount = favoriteBookQueries.filter(query => query.isError).length
  const missingBooksCount = favoriteBookIds.length - favoriteBooks.length
  const unavailableBooksCount = Math.max(failedBooksCount, missingBooksCount)

  const heroTitle = `⭐ ${t('favorites.hero.title')}`
  const heroSubtitle = t('favorites.hero.subtitle')

  const handleSearchClick = () => {
    navigate('/search')
  }

  const handleRetry = () => {
    favoriteBookQueries.forEach(query => {
      if (query.isError) {
        query.refetch()
      }
    })
  }

  if (favoriteIds.size === 0) {
    return (
      <div className='favorites-page'>
        <FavoritesHero title={heroTitle} subtitle={heroSubtitle} />
        <div className='favorites-empty'>
          <div className='favorites-empty__content'>
            <div className='favorites-empty__icon'>📚</div>
            <h2>{t('favorites.emptyTitle')}</h2>
            <p>{t('favorites.emptySubtitle')}</p>
            <button onClick={handleSearchClick} className='favorites-empty__button'>
              {t('search.searchButton')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading && favoriteBooks.length === 0) {
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

      {unavailableBooksCount > 0 && favoriteBooks.length > 0 && (
        <div className='favorites-warning'>
          <p>
            ⚠️ {unavailableBooksCount} {t('favorites.warningLabel')}
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
              <button onClick={handleRetry} className='favorites-error__button'>
                {t('common.tryAgain')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
