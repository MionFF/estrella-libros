import { useState, useEffect, useRef } from 'react'

type Props = {
  threshold?: number // px после которых показывать
  autoHideDelay?: number // ms неактивности перед скрытием
}

export default function ScrollTopButton({ threshold = 300, autoHideDelay = 2000 }: Props) {
  const [visible, setVisible] = useState(false)
  const [autoHidden, setAutoHidden] = useState(false)
  const hideTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > threshold
      setVisible(shouldShow)

      // Если кнопка должна быть видна
      if (shouldShow) {
        // Сбрасываем автоскрытие (показываем кнопку при скролле)
        setAutoHidden(false)

        // Очищаем предыдущий таймер
        if (hideTimerRef.current !== null) {
          clearTimeout(hideTimerRef.current)
        }

        // Запускаем новый таймер на автоскрытие
        hideTimerRef.current = window.setTimeout(() => {
          setAutoHidden(true)
        }, autoHideDelay)
      } else {
        // Если скроллим наверх (< threshold), сбрасываем таймер
        if (hideTimerRef.current !== null) {
          clearTimeout(hideTimerRef.current)
          hideTimerRef.current = null
        }
        setAutoHidden(false)
      }
    }

    onScroll() // Проверка при монтировании
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (hideTimerRef.current !== null) {
        clearTimeout(hideTimerRef.current)
      }
    }
  }, [threshold, autoHideDelay])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type='button'
      title='Scroll to top'
      onClick={scrollToTop}
      className={`scroll-top ${visible ? 'scroll-top--visible' : ''} ${
        autoHidden ? 'scroll-top--auto-hidden' : ''
      }`}
      aria-label='Scroll to top'
    >
      <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true'>
        <path d='M12 5l-7 7h4v7h6v-7h4l-7-7z' fill='currentColor' />
      </svg>
    </button>
  )
}
