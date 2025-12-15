import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecommendationsList from './RecommendationsList'
import { useRecommendations } from '../../../hooks/useRecommendations'

const mockLoadRecommendations = jest.fn()

jest.mock('../../../shared/Loader/Loader.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid={'loader'}>Loading...</div>,
}))

jest.mock('../../components/BookCard/BookCard.tsx', () => ({
  __esModule: true,
  // eslint-disable-next-line
  default: ({ book }: any) => <div data-testid={'book-card'}>{book.title}</div>,
}))

jest.mock('../../../hooks/useRecommendations.ts', () => ({
  useRecommendations: jest.fn(),
}))

const mockUseRecommendations = useRecommendations as jest.Mock

describe('RecommendationsList', () => {
  beforeEach(() => {
    mockUseRecommendations.mockClear()
    mockLoadRecommendations.mockClear()
  })

  test('renders loading state', () => {
    mockUseRecommendations.mockReturnValue({
      books: [],
      loading: true,
      error: null,
      loadRecommendations: mockLoadRecommendations,
    })

    render(<RecommendationsList />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('recommendations.list.loadingLabel')).toBeInTheDocument()
  })

  test('renders error state', () => {
    mockUseRecommendations.mockReturnValue({
      books: [],
      loading: false,
      error: 'Network error',
      loadRecommendations: mockLoadRecommendations,
    })

    render(<RecommendationsList />)

    expect(
      screen.getByRole('heading', { name: 'recommendations.list.errorLabel' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  test('renders book list', () => {
    mockUseRecommendations.mockReturnValue({
      books: [
        { id: '1', title: 'Dolores Claiborne' },
        { id: '2', title: 'The Long Walk' },
      ],
      loading: false,
      error: null,
      loadRecommendations: mockLoadRecommendations,
    })

    render(<RecommendationsList />)

    expect(screen.getAllByTestId('book-card')).toHaveLength(2)
  })

  test('renders empty book list', () => {
    mockUseRecommendations.mockReturnValue({
      books: [],
      loading: false,
      error: null,
      loadRecommendations: mockLoadRecommendations,
    })

    render(<RecommendationsList />)

    expect(
      screen.getByRole('heading', { name: 'recommendations.list.emptyTitle' }),
    ).toBeInTheDocument()
    expect(screen.getByText('recommendations.list.emptySubtitle')).toBeInTheDocument()
  })

  test('retries on retry button click', async () => {
    const user = userEvent.setup()

    mockUseRecommendations.mockReturnValue({
      books: [],
      loading: false,
      error: 'Network error',
      loadRecommendations: mockLoadRecommendations,
    })

    render(<RecommendationsList />)

    // Очищаем историю вызовов после рендера (убираем вызов из useEffect)
    mockLoadRecommendations.mockClear()

    const button = screen.getByRole('button', { name: /common.tryAgain/i })
    await user.click(button)

    expect(mockLoadRecommendations).toHaveBeenCalledTimes(1)
  })

  test('refreshes empty book list on refresh button click', async () => {
    const user = userEvent.setup()

    mockUseRecommendations.mockReturnValue({
      books: [],
      loading: false,
      error: null,
      loadRecommendations: mockLoadRecommendations,
    })

    render(<RecommendationsList />)

    // Очищаем историю вызовов после рендера (убираем вызов из useEffect)
    mockLoadRecommendations.mockClear()

    const button = screen.getByRole('button', {
      name: /recommendations.list.refreshRecommendations/i,
    })
    await user.click(button)

    expect(mockLoadRecommendations).toHaveBeenCalledTimes(1)
  })
})
