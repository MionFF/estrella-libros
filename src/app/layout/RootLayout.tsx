import { NavLink, Outlet } from 'react-router-dom'
import Header from '../../widgets/Header/Header'
import Footer from '../../widgets/Footer/Footer'
import ScrollTopButton from '../../features/ScrollTopButton/ScrollTopButton'
import LanguageMenu from '../../features/components/LanguageMenu/LanguageMenu'
import { useTranslation } from 'react-i18next'

export default function RootLayout() {
  const { t } = useTranslation('common')

  return (
    <>
      <Header>
        <LanguageMenu />
        <NavLink to={'favorites'}>{t('header.favorites')}</NavLink>
        <NavLink to={'genres'}>{t('header.genres')}</NavLink>
        <NavLink to={'recommendations'}>{t('header.recommendations')}</NavLink>
        <NavLink to={'search'}>{t('header.search')}</NavLink>
        <NavLink to={'/'}>{t('header.home')}</NavLink>
      </Header>

      <main>
        <Outlet />
      </main>

      <Footer>Estrella Libros</Footer>
      <ScrollTopButton threshold={300} autoHideDelay={2000} />
    </>
  )
}
