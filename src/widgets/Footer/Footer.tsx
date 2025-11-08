import type React from 'react'

export default function Footer({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear()

  return (
    <footer className='footer'>
      <div className='footer__container'>
        {/* Основной контент */}
        <div className='footer__content'>
          {/* Логотип и описание */}
          <div className='footer__brand'>
            <div className='footer__logo'>
              <span className='footer__logo-icon'>📚</span>
              <span className='footer__logo-text'>Estrella Libros</span>
            </div>
            <p className='footer__description'>
              Your gateway to a universe of stories. Discover, explore, and fall in love with books.
            </p>
          </div>

          {/* Навигационные ссылки */}
          <nav className='footer__nav'>
            <div className='footer__nav-section'>
              <h4>Explore</h4>
              <a href='/'>Home</a>
              <a href='/search'>Search</a>
              <a href='/recommendations'>Recommendations</a>
            </div>
            <div className='footer__nav-section'>
              <h4>Support</h4>
              <a href='/help'>Help Center</a>
              <a href='/contact'>Contact Us</a>
              <a href='/feedback'>Feedback</a>
            </div>
            <div className='footer__nav-section'>
              <h4>Legal</h4>
              <a href='/privacy'>Privacy Policy</a>
              <a href='/terms'>Terms of Service</a>
              <a href='/cookies'>Cookies</a>
            </div>
          </nav>
        </div>

        {/* Нижняя часть с копирайтом */}
        <div className='footer__bottom'>
          <div className='footer__copyright'>
            &copy; {year} {children}. All rights reserved.
          </div>
          <div className='footer__social'>
            <span>Follow us:</span>
            <a href='#' aria-label='Twitter'>
              🐦
            </a>
            <a href='#' aria-label='Facebook'>
              📘
            </a>
            <a href='#' aria-label='Instagram'>
              📷
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
