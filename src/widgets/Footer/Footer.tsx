import type React from 'react'
import { useTranslation } from 'react-i18next'

export default function Footer({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear()
  const { t } = useTranslation('common')

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
            <p className='footer__description'>{t('footer.description')}</p>
          </div>

          {/* Навигационные ссылки */}
          <nav className='footer__nav'>
            <div className='footer__nav-section'>
              <h4>{t('footer.explore')}</h4>
              <a href='/'>{t('header.home')}</a>
              <a href='/search'>{t('header.search')}</a>
              <a href='/recommendations'>{t('header.recommendations')}</a>
            </div>
            <div className='footer__nav-section'>
              <h4>{t('footer.support')}</h4>
              <a href='/help'>{t('footer.helpCenter')}</a>
              <a href='/contact'>{t('footer.contactUs')}</a>
              <a href='/feedback'>{t('footer.feedback')}</a>
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
