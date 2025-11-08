import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import Loader from '../../../shared/Loader/Loader'
import React, { useState } from 'react'
import BookCard from '../BookCard/BookCard'

export default function BooksList() {
  const { books, loading, error, searchBooks, clearBooks } = useGoogleBooks()
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (query: string) => {
    if (!query.trim()) return

    setSearchQuery(query)
    searchBooks(query, 20)
  }

  const handleClear = () => {
    setSearchQuery('')
    setHasSearched(false)
    clearBooks()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
    }
  }

  return (
    <div className='search-books'>
      {/* Поисковая панель */}
      <div className='search-books__header'>
        <div className='search-books__input-group'>
          <div className='search-books__input-wrapper'>
            <input
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Search by title, author, genre...'
              className='search-books__input'
            />
            <span className='search-books__icon'>🔍</span>
          </div>

          <div className='search-books__actions'>
            <button
              onClick={() => handleSearch(searchQuery)}
              disabled={!searchQuery.trim() || loading}
              className='search-books__button search-books__button--primary'
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={handleClear}
              className='search-books__button search-books__button--secondary'
            >
              Clear
            </button>
          </div>
        </div>

        {/* Быстрые подсказки */}
        <div className='search-books__suggestions'>
          <span>Try:</span>
          {['fiction', 'science', 'mystery', 'programming'].map(tag => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag)
                handleSearch(tag)
              }}
              className='search-books__suggestion-tag'
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Состояние загрузки */}
      {loading && (
        <div className='search-books__loader'>
          <Loader />
          <p>Searching for books...</p>
        </div>
      )}

      {/* Сообщение об ошибке */}
      {error && (
        <div className='search-books__error'>
          <div className='search-books__error-message'>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button
              onClick={() => handleSearch(searchQuery)}
              className='search-books__button search-books__button--primary'
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Результаты поиска */}
      {!loading && !error && (
        <div className='search-books__results'>
          {hasSearched && (
            <div className='search-books__results-header'>
              <h2>
                {books.length > 0
                  ? `Found ${books.length} book${books.length !== 1 ? 's' : ''}`
                  : 'No books found'}
              </h2>
              {searchQuery && <p className='search-books__query'>for "{searchQuery}"</p>}
            </div>
          )}

          {books.length > 0 ? (
            <div>
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : hasSearched ? (
            <div className='search-books__empty'>
              <div className='search-books__empty-icon'>📚</div>
              <h3>No books found</h3>
              <p>Try adjusting your search terms or browse the suggestions above.</p>
            </div>
          ) : (
            <div className='search-books__welcome'>
              <div className='search-books__welcome-icon'>🔍</div>
              <h3>Start Your Book Discovery</h3>
              <p>Search by title, author, genre, or topic to find your next favorite book.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
