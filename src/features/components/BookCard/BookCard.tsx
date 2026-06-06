import { useTranslation } from 'react-i18next'
import type { Book } from '../../types'
import FavoriteButton from '../FavoriteButton/FavoriteButton'
import { useState } from 'react'
import BookModal from '../BookDetailsModal/BookDetailsModal'

interface RecommendationsBookCardProps {
  book: Book
}

export default function BookCard({ book }: RecommendationsBookCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const { t } = useTranslation('common')

  const openModal = () => {
    setSelectedBookId(book.id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedBookId(null)
  }

  return (
    <article className='book-card'>
      <div className='book-card__image'>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className='book-card__img' loading='lazy' />
        ) : (
          <div className='book-card__no-image'>{t('bookCard.noCover')}</div>
        )}
      </div>

      <div className='book-card__body'>
        <div className='book-card__header'>
          <h3 className='book-card__title'>{book.title}</h3>
          <FavoriteButton bookId={book.id} size='md' />
        </div>

        <p className='book-card__authors'>by {book.authors.join(', ')}</p>

        {book.publishedYear && (
          <p className='book-card__year'>
            {t('bookCard.published')}: {book.publishedYear}
          </p>
        )}

        {book.publisher && (
          <p className='book-card__publisher'>
            {t('bookCard.publisher')}: {book.publisher}
          </p>
        )}

        {book.averageRating && (
          <div className='book-card__rating'>
            ⭐ {book.averageRating}/5
            {book.ratingsCount && ` (${book.ratingsCount} reviews)`}
          </div>
        )}

        {book.pageCount && (
          <p className='book-card__pages'>
            {book.pageCount} {t('bookCard.pages')}
          </p>
        )}

        {book.categories && book.categories.length > 0 && (
          <div className='book-card__categories'>
            <strong>{t('bookCard.genres')}:</strong>
            <div className='book-card__tags'>
              {book.categories.slice(0, 3).map((category, index) => (
                <span key={index} className='book-card__tag'>
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {book.description && (
          <div className='book-card__description'>
            <p>
              {book.description.length > 150
                ? `${book.description.substring(0, 150)}...`
                : book.description}
            </p>
          </div>
        )}

        <div className='book-card__actions'>
          <button onClick={openModal} className='book-card__details-btn'>
            {t('bookCard.details')}
          </button>
        </div>

        <div className='book-card__links'>
          {book.previewLink && (
            <a href={book.previewLink} target='_blank' rel='noopener noreferrer'>
              {t('bookCard.preview')}
            </a>
          )}
          {book.infoLink && (
            <a href={book.infoLink} target='_blank' rel='noopener noreferrer'>
              {t('bookCard.moreInfo')}
            </a>
          )}
        </div>

        {isModalOpen && selectedBookId && (
          <BookModal bookId={selectedBookId} isOpen={isModalOpen} onClose={closeModal} />
        )}
      </div>
    </article>
  )
}
