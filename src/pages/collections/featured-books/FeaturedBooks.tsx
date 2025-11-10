import { useEffect } from 'react'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import BookCard from '../../../features/components/BookCard/BookCard'
import Loader from '../../../shared/Loader/Loader'

export default function FeaturedBooks() {
  const { books, loading, error, searchBooks } = useGoogleBooks()
  const FEATURED_BOOKS_QUERY = 'fiction novel literature'

  useEffect(() => {
    searchBooks(FEATURED_BOOKS_QUERY, 40)
  }, [])

  const handleRetry = () => {
    searchBooks(FEATURED_BOOKS_QUERY, 40)
  }

  return (
    <div className='featured-books-page'>
      <div className='featured-books-header'>
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
          <div className='featured-books-loading-overlay'>
            <Loader />
            <p>Discovering remarkable books...</p>
          </div>
        ) : error ? (
          <div className='featured-books-error'>
            <div className='featured-books-error__content'>
              <div className='featured-books-error__icon'>😔</div>
              <h3>Unable to Load Books</h3>
              <p>{error}</p>
              <button onClick={handleRetry} className='featured-books-error__button'>
                Try Again
              </button>
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
                <button onClick={handleRetry} className='featured-books-empty__button'>
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
