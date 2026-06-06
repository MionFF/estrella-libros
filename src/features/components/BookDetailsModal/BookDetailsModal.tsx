import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import type { Book } from '../../types'
import FavoriteButton from '../FavoriteButton/FavoriteButton'
import BookModalSkeleton from '../BookModalSkeleton/BookModalSkeleton'
import { useIsFavorite } from '../../../store/favStore'

interface BookModalProps {
  bookId: string
  isOpen: boolean
  onClose: () => void
}

export default function BookModal({ bookId, isOpen, onClose }: BookModalProps) {
  const { t } = useTranslation('common')
  const { getBookById, loading, error } = useGoogleBooks()
  const [book, setBook] = useState<Book | null>(null)
  const isFavorite = useIsFavorite(bookId)

  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && bookId) {
      const fetchBook = async () => {
        const data = await getBookById(bookId)
        setBook(data)
      }
      fetchBook()
    } else {
      setBook(null)
    }
  }, [isOpen, bookId, getBookById])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && e.target === overlayRef.current) onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
      if (modalRef.current) modalRef.current.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className='book-modal__overlay' ref={overlayRef}>
      <div
        className='book-modal'
        ref={modalRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='book-modal-title'
        tabIndex={-1}
      >
        <button
          className='book-modal__close-btn'
          onClick={onClose}
          aria-label={t('bookModal.close')}
        >
          ×
        </button>

        {loading && !book ? (
          <BookModalSkeleton />
        ) : error ? (
          <div className='book-modal__error'>
            {t('bookModal.error')}: {error}
          </div>
        ) : book ? (
          <article className='book-modal__card'>
            <div className='book-modal__main'>
              <div className='book-modal__image'>
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title} className='book-modal__img' />
                ) : (
                  <div className='book-modal__no-image'>{t('bookCard.noCover')}</div>
                )}
              </div>

              <div className='book-modal__body'>
                <div className='book-modal__header'>
                  <h2 id='book-modal-title' className='book-modal__title'>
                    {book.title}
                  </h2>
                </div>

                <p className='book-modal__authors'>by {book.authors.join(', ')}</p>

                <div className='book-modal__favorite-section'>
                  <FavoriteButton bookId={book.id} size='md' />
                  <span>
                    {isFavorite
                      ? t('bookCard.detailsModal.inFavorites')
                      : t('bookCard.detailsModal.addToFavs')}
                  </span>
                </div>

                {book.publishedYear && (
                  <p className='book-modal__year'>
                    {t('bookCard.published')}: {book.publishedYear}
                  </p>
                )}
                {book.publisher && (
                  <p className='book-modal__publisher'>
                    {t('bookCard.publisher')}: {book.publisher}
                  </p>
                )}
                {book.pageCount && (
                  <p className='book-modal__pages'>
                    {book.pageCount} {t('bookCard.pages')}
                  </p>
                )}
                {book.averageRating && (
                  <div className='book-modal__rating'>
                    ⭐ {book.averageRating}/5
                    {book.ratingsCount && ` (${book.ratingsCount} reviews)`}
                  </div>
                )}

                <div className='book-modal__links'>
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
              </div>
            </div>

            {book.description && (
              <div className='book-modal__section'>
                <h3 className='book-modal__section-title'>
                  {t('bookCard.detailsModal.description')}
                </h3>
                <div className='book-modal__description'>
                  <p dangerouslySetInnerHTML={{ __html: book.description }} />
                </div>
              </div>
            )}

            {book.categories && book.categories.length > 0 && (
              <div className='book-modal__section'>
                <h3 className='book-modal__section-title'>{t('bookCard.genres')}</h3>
                <div className='book-modal__tags'>
                  {book.categories.map((category, index) => (
                    <span key={index} className='book-modal__tag'>
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
