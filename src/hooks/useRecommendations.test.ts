import '@testing-library/jest-dom'
import { act, renderHook } from '@testing-library/react'
import { useRecommendations } from './useRecommendations'
import { useGoogleBooks } from './useGoogleBooks'

const mockSearchBooks = jest.fn()

jest.mock('./useGoogleBooks.ts', () => ({
  useGoogleBooks: jest.fn(),
}))

const mockUseGoogleBooks = useGoogleBooks as jest.Mock

describe('useRecommendations', () => {
  beforeEach(() => {
    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: null,
      searchBooks: mockSearchBooks,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('initial state', () => {
    const { result } = renderHook(() => useRecommendations())

    expect(result.current.books).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test('loadRecommendations calls searchBooks', () => {
    const { result } = renderHook(() => useRecommendations())

    act(() => {
      result.current.loadRecommendations()
    })

    expect(mockSearchBooks).toHaveBeenCalledTimes(1)
    expect(mockSearchBooks).toHaveBeenCalledWith(expect.any(String), 25)
  })

  test('loadRecommendations creates combined query from random strategies', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5)

    const { result } = renderHook(() => useRecommendations())

    act(() => {
      result.current.loadRecommendations()
    })

    const callArg = mockSearchBooks.mock.calls[0][0]

    expect(callArg).toBeTruthy()
    expect(typeof callArg).toBe('string')
    expect(callArg.split(' ').length).toBeGreaterThan(2)

    randomSpy.mockRestore()
  })

  test('propagates loading state from useGoogleBooks', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: true,
      error: null,
      searchBooks: mockSearchBooks,
    })

    const { result } = renderHook(() => useRecommendations())

    expect(result.current.loading).toBe(true)
  })
  test('propagates error state from useGoogleBooks', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: 'Network error',
      searchBooks: mockSearchBooks,
    })

    const { result } = renderHook(() => useRecommendations())

    expect(result.current.error).toBe('Network error')
  })
  test('propagates books from useGoogleBooks', () => {
    const mockBooks = [
      { id: '1', title: 'Mr. Mercedes', authors: ['Stephen King'] },
      { id: '2', title: 'Holly', authors: ['Stephen King'] },
    ]

    mockUseGoogleBooks.mockReturnValue({
      books: mockBooks,
      loading: false,
      error: null,
      searchBooks: mockSearchBooks,
    })

    const { result } = renderHook(() => useRecommendations())

    expect(result.current.books).toEqual(mockBooks)
  })
})
