export default function BookModalSkeleton() {
  return (
    <article className='book-modal__card'>
      <div className='book-modal__main'>
        <div className='book-modal__image book-modal__skeleton-cover'></div>

        <div className='book-modal__body'>
          <div className='book-modal__header'>
            <div className='book-modal__skeleton-title book-modal__skeleton-multiline'>
              <div className='book-modal__skeleton-line'></div>
              <div className='book-modal__skeleton-line book-modal__skeleton-short'></div>
            </div>
          </div>

          <div className='book-modal__skeleton-text book-modal__skeleton-authors'></div>

          <div className='book-modal__favorite-section book-modal__skeleton-favorite'>
            <div className='book-modal__skeleton-favorite-btn'></div>
            <div className='book-modal__skeleton-text book-modal__skeleton-favorite-text'></div>
          </div>

          <div className='book-modal__skeleton-meta'>
            <div className='book-modal__skeleton-meta-item'>
              <div className='book-modal__skeleton-text book-modal__skeleton-meta-label'></div>
              <div className='book-modal__skeleton-text book-modal__skeleton-meta-value'></div>
            </div>
            <div className='book-modal__skeleton-meta-item'>
              <div className='book-modal__skeleton-text book-modal__skeleton-meta-label'></div>
              <div className='book-modal__skeleton-text book-modal__skeleton-meta-value book-modal__skeleton-short'></div>
            </div>
            <div className='book-modal__skeleton-meta-item'>
              <div className='book-modal__skeleton-text book-modal__skeleton-meta-label'></div>
              <div className='book-modal__skeleton-text book-modal__skeleton-meta-value'></div>
            </div>
            <div className='book-modal__skeleton-meta-item'>
              <div className='book-modal__skeleton-text book-modal__skeleton-meta-label'></div>
              <div className='book-modal__skeleton-text book-modal__skeleton-meta-value book-modal__skeleton-short'></div>
            </div>
          </div>

          <div className='book-modal__links book-modal__skeleton-links'>
            <div className='book-modal__skeleton-link'></div>
            <div className='book-modal__skeleton-link'></div>
          </div>
        </div>
      </div>

      <div className='book-modal__section'>
        <div className='book-modal__skeleton-title book-modal__skeleton-medium'></div>
        <div className='book-modal__skeleton-description'>
          <div className='book-modal__skeleton-text'></div>
          <div className='book-modal__skeleton-text'></div>
          <div className='book-modal__skeleton-text book-modal__skeleton-short'></div>
          <div className='book-modal__skeleton-text'></div>
          <div className='book-modal__skeleton-text book-modal__skeleton-short'></div>
        </div>
      </div>

      <div className='book-modal__section'>
        <div className='book-modal__skeleton-title book-modal__skeleton-medium'></div>
        <div className='book-modal__skeleton-tags'>
          <div className='book-modal__skeleton-tag'></div>
          <div className='book-modal__skeleton-tag'></div>
          <div className='book-modal__skeleton-tag'></div>
          <div className='book-modal__skeleton-tag'></div>
          <div className='book-modal__skeleton-tag'></div>
        </div>
      </div>
    </article>
  )
}
