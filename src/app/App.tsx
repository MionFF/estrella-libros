import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import HomePage from '../pages/home/HomePage'
import Recommendations from '../pages/recommendations/Recommendations'
import SearchPage from '../pages/search/SearchPage'
import { ScrollToTop } from '../helpers/ScrollToTop'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path={'search'} element={<SearchPage />} />
          <Route path={'recommendations'} element={<Recommendations />} />
        </Route>
      </Routes>
      <ScrollToTop />
    </BrowserRouter>
  )
}
