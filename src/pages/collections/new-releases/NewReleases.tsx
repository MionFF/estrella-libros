import { useEffect } from 'react'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import BookCard from '../../../features/components/BookCard/BookCard'
import Loader from '../../../shared/Loader/Loader'

export default function NewReleases() {
  const { books, loading, error, searchBooks } = useGoogleBooks()
  const NEW_RELEASES_QUERY = 'subject:fiction 2024 2025'

  useEffect(() => {
    searchBooks(NEW_RELEASES_QUERY, 40)
  }, [])

  const handleRetry = () => {
    searchBooks(NEW_RELEASES_QUERY, 40)
  }

  return (
    <div className='new-releases-page'>
      <div className='new-releases-header'>
        <div className='new-releases-header__content'>
          <h1 className='new-releases-title'>🆕 New Releases</h1>
          <p className='new-releases-subtitle'>
            Fresh books from contemporary authors and publishers
          </p>
          {!loading && books.length > 0 && (
            <div className='new-releases-stats'>
              <span className='new-releases-count'>New Releases collection</span>
            </div>
          )}
        </div>
      </div>

      <div className='new-releases-container'>
        {loading ? (
          <div className='new-releases-loading-overlay'>
            <Loader />
            <p>Loading new releases...</p>
          </div>
        ) : error ? (
          <div className='new-releases-error'>
            <div className='new-releases-error__content'>
              <div className='new-releases-error__icon'>😔</div>
              <h3>Unable to Load New Releases</h3>
              <p>{error}</p>
              <button onClick={handleRetry} className='new-releases-error__button'>
                Try Again
              </button>
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
