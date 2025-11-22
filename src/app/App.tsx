import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import HomePage from '../pages/home/HomePage'
import Recommendations from '../pages/recommendations/Recommendations'
import SearchPage from '../pages/search/SearchPage'
import { ScrollToTop } from '../helpers/ScrollToTop'
import FeaturedBooks from '../pages/collections/featured-books/FeaturedBooks'
import NewReleases from '../pages/collections/new-releases/NewReleases'
import AwardWinners from '../pages/collections/award-winners/AwardWinners'
import Genres from '../pages/genres/Genres/Gengres'
import GenreBookPage from '../pages/genres/GenreBookPage/GenreBookPage'
import FavoritesPage from '../pages/favorites/FavoritesPage'
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    console.log('API Key at build time:', import.meta.env.VITE_GOOGLE_BOOKS_API_KEY)
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path={'search'} element={<SearchPage />} />
          <Route path={'recommendations'} element={<Recommendations />} />
          <Route path={'featured-books'} element={<FeaturedBooks />} />
          <Route path={'new-releases'} element={<NewReleases />} />
          <Route path={'award-winners'} element={<AwardWinners />} />
          <Route path={'genres'} element={<Genres />} />
          <Route path={'genres/:genreId'} element={<GenreBookPage />} />
          <Route path={'favorites'} element={<FavoritesPage />} />
        </Route>
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  )
}
