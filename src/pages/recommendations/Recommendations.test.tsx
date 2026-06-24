import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Recommendations from './Recommendations'

jest.mock('../../features/components/RecommendationsList/RecommendationsList.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid='rec-list'>Recommendations List</div>,
}))

describe('Recommendations', () => {
  test('renders title and subtitle', () => {
    render(<Recommendations />)

    expect(screen.getByRole('heading', { name: 'recommendations.title' })).toBeInTheDocument()
    expect(screen.getByText('recommendations.subtitle')).toBeInTheDocument()
  })

  test('renders all feature tags', () => {
    render(<Recommendations />)

    expect(screen.getByText(/recommendations.featureTag1/i)).toBeInTheDocument()
    expect(screen.getByText(/recommendations.featureTag2/i)).toBeInTheDocument()
    expect(screen.getByText(/recommendations.featureTag3/i)).toBeInTheDocument()
  })

  test('renders recommendations list', () => {
    render(<Recommendations />)

    expect(screen.getByTestId('rec-list')).toBeInTheDocument()
  })
})
