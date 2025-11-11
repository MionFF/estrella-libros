import { useEffect } from 'react'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import BookCard from '../../../features/components/BookCard/BookCard'
import Loader from '../../../shared/Loader/Loader'
import { useNavigate } from 'react-router-dom'

export default function AwardWinners() {
  const { books, loading, error, searchBooks } = useGoogleBooks()
  const AWARD_WINNERS_QUERY = 'award winning prize literature'
  const navigate = useNavigate()

  useEffect(() => {
    searchBooks(AWARD_WINNERS_QUERY, 40)
  }, [])

  const handleRetry = () => {
    searchBooks(AWARD_WINNERS_QUERY, 40)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='award-winners-page'>
      <div className='award-winners-header'>
        {/* Добавляем кнопку назад */}
        <button onClick={handleBack} className='award-winners-back-btn'>
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
          <h1 className='award-winners-title'>🏆 Award Winners</h1>
          <p className='award-winners-subtitle'>
            Critically acclaimed and prize-winning literature
          </p>
          {!loading && books.length > 0 && (
            <div className='award-winners-stats'>
              <span className='award-winners-count'>Featured collection</span>
            </div>
          )}
        </div>
      </div>

      <div className='award-winners-container'>
        {loading ? (
          <div className='award-winners-loading'>
            <Loader />
            <p>Loading award-winning books...</p>
          </div>
        ) : error ? (
          <div className='award-winners-error'>
            <div className='award-winners-error__content'>
              <div className='award-winners-error__icon'>😔</div>
              <h3>Unable to Load Award Winners</h3>
              <p>{error}</p>
              <div className='award-winners-error__actions'>
                <button onClick={handleRetry} className='award-winners-error__button'>
                  Try Again
                </button>
                <button
                  onClick={handleBack}
                  className='award-winners-error__button award-winners-error__button--secondary'
                >
                  Back to Home
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
                <h3>No award-winning books found</h3>
                <p>We couldn't find any books matching your criteria.</p>
                <div className='award-winners-empty__actions'>
                  <button onClick={handleRetry} className='award-winners-empty__button'>
                    Try Again
                  </button>
                  <button
                    onClick={handleBack}
                    className='award-winners-empty__button award-winners-empty__button--secondary'
                  >
                    Back to Home
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
