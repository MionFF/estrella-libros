import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import Loader from '../../../shared/Loader/Loader'
import React, { useState } from 'react'
import BookCard from '../BookCard/BookCard'
import { useTranslation } from 'react-i18next'

export default function BooksList() {
  const { books, loading, error, searchBooks, clearBooks } = useGoogleBooks()
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const { t } = useTranslation('common')

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
              placeholder={t('search.inputPlaceholder')}
              className='search-books__input'
            />
            <span
              style={{
                cursor: !searchQuery.trim() ? 'default' : 'pointer',
                opacity: !searchQuery.trim() ? '0.5' : '1',
              }}
              className='search-books__icon'
              onClick={() => handleSearch(searchQuery)}
            >
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </span>
          </div>

          <div className='search-books__actions'>
            <button
              onClick={() => handleSearch(searchQuery)}
              disabled={!searchQuery.trim() || loading}
              className='search-books__button search-books__button--primary'
            >
              {loading ? t('search.searchingButton') : t('search.searchButton')}
            </button>
            <button
              onClick={handleClear}
              className='search-books__button search-books__button--secondary'
            >
              {t('search.clearButton')}
            </button>
          </div>
        </div>

        {/* Быстрые подсказки */}
        <div className='search-books__suggestions'>
          <span>{t('search.suggestions.try')}</span>
          {[
            t('search.suggestions.fiction'),
            t('search.suggestions.science'),
            t('search.suggestions.mystery'),
            t('search.suggestions.programming'),
          ].map(tag => (
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
          <p>{t('search.loadingLabel')}</p>
        </div>
      )}

      {/* Сообщение об ошибке */}
      {error && (
        <div className='search-books__error'>
          <div className='search-books__error-message'>
            <h3>{t('search.errorMessage')}</h3>
            <p>{error}</p>
            <button
              onClick={() => handleSearch(searchQuery)}
              className='search-books__button search-books__button--primary'
            >
              {t('common.tryAgain')}
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
                  ? t('search.foundBooks', { count: books.length })
                  : t('search.noBooksFound')}
              </h2>
              {searchQuery && (
                <p className='search-books__query'>
                  {t('search.searchFor', { query: searchQuery })}
                </p>
              )}
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
              <h3>{t('search.emptyTitle')}</h3>
              <p>{t('search.emptySubtitle')}</p>
            </div>
          ) : (
            <div className='search-books__welcome'>
              <div className='search-books__welcome-icon'>🔍</div>
              <h3>{t('search.welcomeTitle')}</h3>
              <p>{t('search.welcomeSubtitle')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
