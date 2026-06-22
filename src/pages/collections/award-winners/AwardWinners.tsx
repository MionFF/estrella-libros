import { useBooksSearchQuery } from '../../../features/books/bookQueries'
import BookCard from '../../../features/components/BookCard/BookCard'
import Loader from '../../../shared/Loader/Loader'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function AwardWinners() {
  const AWARD_WINNERS_QUERY = 'award winning prize literature'

  const {
    data: books = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useBooksSearchQuery(AWARD_WINNERS_QUERY, 40)

  const loading = isLoading || isFetching
  const errorMessage = error instanceof Error ? error.message : null

  const navigate = useNavigate()

  const { t } = useTranslation('common')

  const handleRetry = () => {
    refetch()
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='award-winners-page'>
      <div className='award-winners-header'>
        {/* Добавляем кнопку назад */}
        <button onClick={handleBack} className='award-winners-back-btn' aria-label='Go back'>
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

        <div className='award-winners-header__content'>
          <h1 className='award-winners-title'>
            🏆 {t('home.featuredCollection.awardWinners.title')}
          </h1>
          <p className='award-winners-subtitle'>
            {t('home.featuredCollection.awardWinners.description')}
          </p>
          {!loading && books.length > 0 && (
            <div className='award-winners-stats'>
              <span className='award-winners-count'>
                {t('home.featuredCollection.awardWinners.tagline')}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className='award-winners-container'>
        {loading ? (
          <div className='award-winners-loading'>
            <Loader />
            <p>{t('loading.loadingAwardWinners')}</p>
          </div>
        ) : isError && errorMessage ? (
          <div className='award-winners-error'>
            <div className='award-winners-error__content'>
              <div className='award-winners-error__icon'>😔</div>
              <h3>{t('home.featuredCollection.awardWinners.unableToLoad')}</h3>
              <p>{errorMessage}</p>
              <div className='award-winners-error__actions'>
                <button onClick={handleRetry} className='award-winners-error__button'>
                  {t('common.tryAgain')}
                </button>
                <button
                  onClick={handleBack}
                  className='award-winners-error__button award-winners-error__button--secondary'
                >
                  {t('common.backToHome')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='award-winners-list'>
            {books.length > 0 ? (
              books.map(book => <BookCard key={book.id} book={book} />)
            ) : (
              <div className='award-winners-empty'>
                <div className='award-winners-empty__icon'>📚</div>
                <h3>{t('home.featuredCollection.awardWinners.noBooksFound')}</h3>
                <p>{t('home.featuredCollection.awardWinners.errorDescription')}</p>
                <div className='award-winners-empty__actions'>
                  <button onClick={handleRetry} className='award-winners-empty__button'>
                    {t('common.tryAgain')}
                  </button>
                  <button
                    onClick={handleBack}
                    className='award-winners-empty__button award-winners-empty__button--secondary'
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
