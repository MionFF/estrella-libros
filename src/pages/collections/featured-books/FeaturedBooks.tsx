import { useEffect } from 'react'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import { useNavigate } from 'react-router-dom'
import BookCard from '../../../features/components/BookCard/BookCard'
import Loader from '../../../shared/Loader/Loader'

export default function FeaturedBooks() {
  const { books, loading, error, searchBooks } = useGoogleBooks()
  const FEATURED_BOOKS_QUERY = 'fiction novel literature'
  const navigate = useNavigate()

  useEffect(() => {
    searchBooks(FEATURED_BOOKS_QUERY, 40)
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
        <button onClick={handleBack} className='featured-books-back-btn'>
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
          <h1 className='featured-books-title'>📖 Featured Books</h1>
          <p className='featured-books-subtitle'>
            Handpicked selection of remarkable literary works
          </p>
          {!loading && books.length > 0 && (
            <div className='featured-books-stats'>
              <span className='featured-books-count'>Featured collection</span>
            </div>
          )}
        </div>
      </div>

      <div className='featured-books-container'>
        {loading ? (
          <div className='featured-books-loading'>
            <Loader />
            <p>Discovering remarkable books...</p>
          </div>
        ) : error ? (
          <div className='featured-books-error'>
            <div className='featured-books-error__content'>
              <div className='featured-books-error__icon'>😔</div>
              <h3>Unable to Load Books</h3>
              <p>{error}</p>
              <div className='featured-books-error__actions'>
                <button onClick={handleRetry} className='featured-books-error__button'>
                  Try Again
                </button>
                <button
                  onClick={handleBack}
                  className='featured-books-error__button featured-books-error__button--secondary'
                >
                  Back to Home
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
                <h3>No Books Found</h3>
                <p>We couldn't find any books matching your criteria.</p>
                <div className='featured-books-empty__actions'>
                  <button onClick={handleRetry} className='featured-books-empty__button'>
                    Try Again
                  </button>
                  <button
                    onClick={handleBack}
                    className='featured-books-empty__button featured-books-empty__button--secondary'
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
