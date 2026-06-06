import { useRecommendations } from '../../../hooks/useRecommendations'
import { useEffect, useState } from 'react'
import BookCard from '../BookCard/BookCard'
import Loader from '../../../shared/Loader/Loader'
import { useTranslation } from 'react-i18next'

export default function RecommendationsList() {
  const { books, loading, error, loadRecommendations } = useRecommendations()
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const { i18n, t } = useTranslation('common')

  useEffect(() => {
    loadRecommendations()
    setLastUpdated(
      new Date().toLocaleDateString(i18n.language, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    )
    // eslint-disable-next-line
  }, [])

  const handleRefresh = () => {
    loadRecommendations()
    setLastUpdated(
      new Date().toLocaleDateString(i18n.language, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    )
  }

  if (loading)
    return (
      <div className='recommendations-loading'>
        <Loader />
        <p>{t('recommendations.list.loadingLabel')}</p>
      </div>
    )

  if (error)
    return (
      <div className='recommendations-error'>
        <div className='recommendations-error__content'>
          <div className='recommendations-error__icon'>😔</div>
          <h3>{t('recommendations.list.errorLabel')}</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className='recommendations-error__button'>
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    )

  return (
    <div className='recommendations-content'>
      <div className='recommendations-header'>
        <div className='recommendations-header__info'>
          <h2>{t('recommendations.list.title')}</h2>
          {lastUpdated && (
            <p className='recommendations-header__updated'>
              {t('recommendations.list.lastUpdated')} {lastUpdated}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className='recommendations-header__refresh'
          disabled={loading}
        >
          <svg
            className={`refresh-icon ${loading ? 'refresh-icon--spinning' : ''}`}
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M23 4V10H17'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M1 20V14H7'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M3.51 9C4.01717 7.56678 4.87913 6.2854 6.01547 5.27542C7.1518 4.26543 8.52547 3.55976 10.0083 3.22426C11.4911 2.88875 13.0348 2.93434 14.4952 3.35677C15.9556 3.77921 17.2853 4.56471 18.36 5.64L23 10M1 14L5.64 18.36C6.71475 19.4353 8.04437 20.2208 9.50481 20.6432C10.9652 21.0657 12.5089 21.1113 13.9917 20.7757C15.4745 20.4402 16.8482 19.7346 17.9845 18.7246C19.1209 17.7146 19.9828 16.4332 20.49 15'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          {t('recommendations.list.refreshButton')}
        </button>
      </div>

      {books.length > 0 ? (
        <div className='books-grid books-grid--recommendations'>
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className='recommendations-empty'>
          <div className='recommendations-empty__icon'>📚</div>
          <h3>{t('recommendations.list.emptyTitle')}</h3>
          <p>{t('recommendations.list.emptySubtitle')}</p>
          <button onClick={handleRefresh} className='recommendations-empty__button'>
            {t('recommendations.list.refreshRecommendations')}
          </button>
        </div>
      )}

      <div className='recommendations-footer'>
        <p>
          💡 <strong>{t('recommendations.list.footerTip')}</strong>{' '}
          {t('recommendations.list.footerTipContent')}
        </p>
      </div>
    </div>
  )
}
