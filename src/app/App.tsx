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

export default function App() {
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
        </Route>
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  )
}
