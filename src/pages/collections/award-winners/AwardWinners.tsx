import { useEffect } from 'react'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import BookCard from '../../../features/components/BookCard/BookCard'
import Loader from '../../../shared/Loader/Loader'

export default function AwardWinners() {
  const { books, loading, error, searchBooks } = useGoogleBooks()
  const AWARD_WINNERS_QUERY = 'award winning prize literature'

  useEffect(() => {
    searchBooks(AWARD_WINNERS_QUERY, 40)
  }, [])

  const handleRetry = () => {
    searchBooks(AWARD_WINNERS_QUERY, 40)
  }

  return (
    <div className='award-winners-page'>
      <div className='award-winners-header'>
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
          <div className='award-winners-loading-overlay'>
            <Loader />
            <p>Loading award-winning books...</p>
          </div>
        ) : error ? (
          <div className='award-winners-error'>
            <div className='award-winners-error__content'>
              <div className='award-winners-error__icon'>😔</div>
              <h3>Unable to Load Award Winners</h3>
              <p>{error}</p>
              <button onClick={handleRetry} className='award-winners-error__button'>
                Try Again
              </button>
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
                <button onClick={handleRetry} className='award-winners-empty__button'>
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
