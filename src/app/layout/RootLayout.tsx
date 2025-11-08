import { NavLink, Outlet } from 'react-router-dom'
import Header from '../../widgets/Header/Header'
import Footer from '../../widgets/Footer/Footer'

export default function RootLayout() {
  return (
    <>
      <Header>
        <NavLink to={'recommendations'}>Recommendations</NavLink>
        <NavLink to={'search'}>Search</NavLink>
        <NavLink to={'/'}>Home</NavLink>
      </Header>

      <main>
        <Outlet />
      </main>

      <Footer>Estrella Libros</Footer>
    </>
  )
}
