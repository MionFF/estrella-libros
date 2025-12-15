import { useEffect } from 'react'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import { useNavigate } from 'react-router-dom'
import BookCard from '../../../features/components/BookCard/BookCard'
import Loader from '../../../shared/Loader/Loader'
import { useTranslation } from 'react-i18next'

export default function FeaturedBooks() {
  const { books, loading, error, searchBooks } = useGoogleBooks()
  const FEATURED_BOOKS_QUERY = 'fiction novel literature'
  const navigate = useNavigate()

  const { t } = useTranslation('common')

  useEffect(() => {
    searchBooks(FEATURED_BOOKS_QUERY, 40)
    // eslint-disable-next-line
  }, [])

  const handleRetry = () => {
    searchBooks(FEATURED_BOOKS_QUERY, 40)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='featured-books-page'>
      <div className='featured-books-header'>
        {/* Выносим кнопку назад отдельно от контента */}
        <button onClick={handleBack} className='featured-books-back-btn' aria-label='Go back'>
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

        <div className='featured-books-header__content'>
          <h1 className='featured-books-title'>
            📖 {t('home.featuredCollection.featuredBooks.title')}
          </h1>
          <p className='featured-books-subtitle'>
            {t('home.featuredCollection.featuredBooks.description')}
          </p>
          {!loading && books.length > 0 && (
            <div className='featured-books-stats'>
              <span className='featured-books-count'>
                {t('home.featuredCollection.featuredBooks.tagline')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className='featured-books-container'>
        {loading ? (
          <div className='featured-books-loading'>
            <Loader />
            <p>{t('loading.discoveringBooks')}</p>
          </div>
        ) : error ? (
          <div className='featured-books-error'>
            <div className='featured-books-error__content'>
              <div className='featured-books-error__icon'>😔</div>
              <h3>{t('home.featuredCollection.featuredBooks.unableToLoad')}</h3>
              <p>{error}</p>
              <div className='featured-books-error__actions'>
                <button onClick={handleRetry} className='featured-books-error__button'>
                  {t('common.tryAgain')}
                </button>
                <button
                  onClick={handleBack}
                  className='featured-books-error__button featured-books-error__button--secondary'
                >
                  {t('common.backToHome')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='featured-books-list'>
            {books.length > 0 ? (
              books.map(book => <BookCard key={book.id} book={book} />)
            ) : (
              <div className='featured-books-empty'>
                <div className='featured-books-empty__icon'>📚</div>
                <h3>{t('home.featuredCollection.featuredBooks.noBooksFound')}</h3>
                <p>{t('home.featuredCollection.featuredBooks.errorDescription')}</p>
                <div className='featured-books-empty__actions'>
                  <button onClick={handleRetry} className='featured-books-empty__button'>
                    {t('common.tryAgain')}
                  </button>
                  <button
                    onClick={handleBack}
                    className='featured-books-empty__button featured-books-empty__button--secondary'
                  >
                    {t('common.backToHome')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
