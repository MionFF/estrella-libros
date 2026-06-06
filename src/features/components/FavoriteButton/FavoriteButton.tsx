import { useEffect, useState } from 'react'
import { toggle, useIsFavorite } from '../../../store/favStore'
import clsx from 'clsx'

interface Props {
  bookId: string
  size?: 'mn' | 'sm' | 'md' | 'lg'
  labelOn?: string
  labelOff?: string
}

export default function FavoriteButton({
  bookId,
  size = 'md',
  labelOn = 'Remove from favorites',
  labelOff = 'Add to favorites',
}: Props) {
  const pressed = useIsFavorite(bookId)
  const [justToggled, setJustToggled] = useState(false)

  const handleClick = () => {
    const willBeFavorite = !pressed
    toggle(bookId)

    if (willBeFavorite) {
      setJustToggled(true)
    }

    // Log for debugging favorite array
    // if (import.meta.env.DEV) {
    //   console.log('fav ids:', Array.from(favStore.getState().ids)) // import { favStore } is required!
    // }
  }

  useEffect(() => {
    if (justToggled) {
      const ANIMATION_DURATION = 450
      const timer = setTimeout(() => setJustToggled(false), ANIMATION_DURATION + 50)
      return () => clearTimeout(timer)
    }
  }, [justToggled])

  return (
    <>
      <button
        type='button'
        className={clsx(
          'fav-btn',
          `fav-btn--${size}`,
          pressed && 'fav-btn--on',
          justToggled && 'fav-btn--animate',
        )}
        aria-pressed={pressed}
        aria-label={pressed ? labelOn : labelOff}
        data-testid='favorite-button'
        onClick={handleClick}
      >
        <svg aria-hidden='true' focusable='false' className='fav-btn__icon' viewBox='0 0 24 24'>
          <path
            className='fav-btn__path'
            d='M19.5 12.572L12 20l-7.5-7.428a5 5 0 1 1 7.5-6.566 5 5 0 1 1 7.5 6.566Z'
          />
        </svg>
      </button>
    </>
  )
}
