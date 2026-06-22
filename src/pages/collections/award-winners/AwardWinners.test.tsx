import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockNavigate = jest.fn()
const mockRefetch = jest.fn()

type MockBook = {
  id: string
  title: string
}

type MockBooksSearchQueryResult = {
  data: MockBook[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  refetch: jest.Mock
}

const createBooksSearchQueryResult = (
  overrides: Partial<MockBooksSearchQueryResult> = {},
): MockBooksSearchQueryResult => ({
  data: [],
  isLoading: false,
  isFetching: false,
  isError: false,
  error: null,
  refetch: mockRefetch,
  ...overrides,
})

// eslint-disable-next-line no-var
var mockUseBooksSearchQuery = jest.fn<
  MockBooksSearchQueryResult,
  [query: string, maxResults?: number]
>(() => createBooksSearchQueryResult())

jest.mock('../../../features/books/bookQueries', () => ({
  useBooksSearchQuery: mockUseBooksSearchQuery,
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('../../../features/components/BookCard/BookCard.tsx', () => ({
  __esModule: true,
  default: ({ book }: { book: MockBook }) => <div data-testid='book-card'>{book.title}</div>,
}))

jest.mock('../../../shared/Loader/Loader.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid='loader'>Loading...</div>,
}))

import AwardWinners from './AwardWinners'

describe('AwardWinners', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseBooksSearchQuery.mockReturnValue(createBooksSearchQueryResult())
  })

  test('renders header section', () => {
    render(<AwardWinners />)

    expect(mockUseBooksSearchQuery).toHaveBeenCalledWith('award winning prize literature', 40)
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /home.featuredCollection.awardWinners.title/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('home.featuredCollection.awardWinners.description')).toBeInTheDocument()
  })

  test('renders loading state', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isLoading: true,
      }),
    )

    render(<AwardWinners />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('loading.loadingAwardWinners')).toBeInTheDocument()
  })

  test('renders fetching state', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isFetching: true,
      }),
    )

    render(<AwardWinners />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('loading.loadingAwardWinners')).toBeInTheDocument()
  })

  test('renders error state with buttons', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isError: true,
        error: new Error('Network error'),
      }),
    )

    render(<AwardWinners />)

    expect(
      screen.getByRole('heading', { name: 'home.featuredCollection.awardWinners.unableToLoad' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.tryAgain' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.backToHome' })).toBeInTheDocument()
  })

  test('renders empty state with buttons', () => {
    render(<AwardWinners />)

    expect(
      screen.getByRole('heading', { name: 'home.featuredCollection.awardWinners.noBooksFound' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('home.featuredCollection.awardWinners.errorDescription'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.tryAgain' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.backToHome' })).toBeInTheDocument()
  })

  test('renders book list with tagline', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        data: [
          { id: '1', title: 'Book 1' },
          { id: '2', title: 'Book 2' },
        ],
      }),
    )

    render(<AwardWinners />)

    expect(screen.getAllByTestId('book-card')).toHaveLength(2)
    expect(screen.getByText('home.featuredCollection.awardWinners.tagline')).toBeInTheDocument()
  })

  test('refetches on retry button click', async () => {
    const user = userEvent.setup()

    render(<AwardWinners />)

    await user.click(screen.getByRole('button', { name: 'common.tryAgain' }))

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  test('navigates back on back button clicks', async () => {
    const user = userEvent.setup()

    render(<AwardWinners />)

    await user.click(screen.getByRole('button', { name: 'Go back' }))
    expect(mockNavigate).toHaveBeenCalledWith(-1)

    mockNavigate.mockClear()

    await user.click(screen.getByRole('button', { name: 'common.backToHome' }))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
