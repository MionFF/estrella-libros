import '@testing-library/jest-dom'
import { act, renderHook } from '@testing-library/react'
import type { Book } from '../features/types'

type MockBooksSearchQueryResult = {
  data: Book[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
}

const createBooksSearchQueryResult = (
  overrides: Partial<MockBooksSearchQueryResult> = {},
): MockBooksSearchQueryResult => ({
  data: [],
  isLoading: false,
  isFetching: false,
  isError: false,
  error: null,
  ...overrides,
})

// eslint-disable-next-line no-var
var mockUseBooksSearchQuery = jest.fn<
  MockBooksSearchQueryResult,
  [query: string, maxResults?: number]
>(() => createBooksSearchQueryResult())

jest.mock('../features/books/bookQueries', () => ({
  useBooksSearchQuery: mockUseBooksSearchQuery,
}))

import { useRecommendations } from './useRecommendations'

describe('useRecommendations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseBooksSearchQuery.mockReturnValue(createBooksSearchQueryResult())
  })

  test('initial state uses empty query and does not expose loading or error', () => {
    const { result } = renderHook(() => useRecommendations())

    expect(mockUseBooksSearchQuery).toHaveBeenCalledWith('', 25)
    expect(result.current.books).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test('loadRecommendations updates query for TanStack Query search', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5)

    const { result } = renderHook(() => useRecommendations())

    act(() => {
      result.current.loadRecommendations()
    })

    const calls = mockUseBooksSearchQuery.mock.calls
    const lastCall = calls[calls.length - 1]

    expect(lastCall).toBeDefined()

    const [query, maxResults] = lastCall

    expect(query).toEqual(expect.any(String))
    expect(query).not.toBe('')
    expect(maxResults).toBe(25)

    randomSpy.mockRestore()
  })

  test('returns loading state from query hook', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isLoading: true,
      }),
    )

    const { result } = renderHook(() => useRecommendations())

    expect(result.current.loading).toBe(true)
  })

  test('returns fetching state as loading', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isFetching: true,
      }),
    )

    const { result } = renderHook(() => useRecommendations())

    expect(result.current.loading).toBe(true)
  })

  test('returns error message from query hook', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isError: true,
        error: new Error('Network error'),
      }),
    )

    const { result } = renderHook(() => useRecommendations())

    expect(result.current.error).toBe('Network error')
  })

  test('returns null error when query has unknown error shape', () => {
    mockUseBooksSearchQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      isError: true,
      error: null,
    })

    const { result } = renderHook(() => useRecommendations())

    expect(result.current.error).toBeNull()
  })

  test('returns books from query hook', () => {
    const mockBooks: Book[] = [
      { id: '1', title: 'Mr. Mercedes', authors: ['Stephen King'] },
      { id: '2', title: 'Holly', authors: ['Stephen King'] },
    ]

    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        data: mockBooks,
      }),
    )

    const { result } = renderHook(() => useRecommendations())

    expect(result.current.books).toEqual(mockBooks)
  })
})
