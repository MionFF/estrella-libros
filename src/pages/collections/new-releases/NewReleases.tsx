import { useEffect } from 'react'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import BookCard from '../../../features/components/BookCard/BookCard'
import Loader from '../../../shared/Loader/Loader'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NewReleases() {
  const { books, loading, error, searchBooks } = useGoogleBooks()
  const NEW_RELEASES_QUERY = 'subject:fiction 2024 2025'
  const navigate = useNavigate()

  const { t } = useTranslation('common')

  useEffect(() => {
    searchBooks(NEW_RELEASES_QUERY, 40)
  }, [])

  const handleRetry = () => {
    searchBooks(NEW_RELEASES_QUERY, 40)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='new-releases-page'>
      <div className='new-releases-header'>
        {/* Выносим кнопку назад отдельно от контента */}
        <button onClick={handleBack} className='new-releases-back-btn'>
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M15 18L9 12L15 6'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>

        <div className='new-releases-header__content'>
          <h1 className='new-releases-title'>
            🆕 {t('home.featuredCollection.newReleases.title')}
          </h1>
          <p className='new-releases-subtitle'>
            {t('home.featuredCollection.newReleases.description')}
          </p>
          {!loading && books.length > 0 && (
            <div className='new-releases-stats'>
              <span className='new-releases-count'>
                {t('home.featuredCollection.newReleases.count')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className='new-releases-container'>
        {loading ? (
          <div className='new-releases-loading'>
            <Loader />
            <p>{t('loading.loadingNewReleases')}</p>
          </div>
        ) : error ? (
          <div className='new-releases-error'>
            <div className='new-releases-error__content'>
              <div className='new-releases-error__icon'>😔</div>
              <h3>Unable to Load New Releases</h3>
              <p>{error}</p>
              <div className='new-releases-error__actions'>
                <button onClick={handleRetry} className='new-releases-error__button'>
                  {t('common.tryAgain')}
                </button>
                <button
                  onClick={handleBack}
                  className='new-releases-error__button new-releases-error__button--secondary'
                >
                  {t('common.backToHome')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='new-releases-list'>
            {books.length > 0 ? (
              books.map(book => <BookCard key={book.id} book={book} />)
            ) : (
              <div className='new-releases-empty'>
                <div className='new-releases-empty__icon'>📚</div>
                <h3>No New Releases Found</h3>
                <p>We couldn't find any new books matching your criteria.</p>
                <button onClick={handleRetry} className='new-releases-empty__button'>
                  {t('common.tryAgain')}
                </button>
                <button
                  onClick={handleBack}
                  className='featured-books-error__button featured-books-error__button--secondary'
                >
                  {t('common.backToHome')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
