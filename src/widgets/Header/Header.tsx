import { useState, useEffect } from 'react'

export default function Header({
  children,
  mobileNavbarExtra,
}: {
  children: React.ReactNode
  mobileNavbarExtra?: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [children])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleMobileLinkClick = () => {
      setIsMenuOpen(false)
    }

    const mobileLinks = document.querySelectorAll('.header__mobile-nav-content a')
    mobileLinks.forEach(link => {
      link.addEventListener('click', handleMobileLinkClick)
    })

    return () => {
      mobileLinks.forEach(link => {
        link.removeEventListener('click', handleMobileLinkClick)
      })
    }
  }, [isMenuOpen])

  return (
    <header className='header' data-testid='header'>
      <div className='header__container'>
        {/* Логотип */}
        <div className='header__logo'>
          <span className='header__logo-icon'>📚</span>
          <span className='header__logo-text'>Estrella Libros</span>
        </div>

        {/* Навигация для десктопа */}
        <nav className='header__nav' data-testid='desktop-nav'>
          {children}
        </nav>

        {/* LanguageMenu для мобилы (в navbar) */}
        {mobileNavbarExtra && (
          <div className='header__mobile-navbar-extra' data-testid='mobile-nav-extra'>
            {mobileNavbarExtra}
          </div>
        )}

        {/* Кнопка мобильного меню */}
        <button
          className={`header__menu-toggle ${isMenuOpen ? 'header__menu-toggle--active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label='Toggle menu'
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Мобильное меню */}
        <div className={`header__mobile-nav ${isMenuOpen ? 'header__mobile-nav--open' : ''}`}>
          <div className='header__mobile-nav-content' data-testid='mobile-nav'>
            {children}
          </div>
        </div>

        {/* Оверлей для мобильного меню */}
        <div
          className={`header__overlay ${isMenuOpen ? 'header__overlay--visible' : ''}`}
          onClick={() => setIsMenuOpen(false)}
          data-testid='overlay'
        />
      </div>
    </header>
  )
}
