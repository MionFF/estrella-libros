import '@testing-library/jest-dom'
import { act, renderHook, waitFor } from '@testing-library/react'

jest.mock('../config/env.ts', () => ({
  getApiKey: () => 'test-key',
  BASE_URL: 'https://www.googleapis.com/books/v1/volumes',
}))

jest.mock('../utils/htmlSanitizer.ts', () => ({
  stripHtmlTags: (str: string) => str,
  cleanCategories: (arr: string[]) => arr,
}))

import { useGoogleBooks } from './useGoogleBooks'

const mockData = {
  items: [
    {
      id: '1',
      volumeInfo: {
        title: 'Holly',
        authors: ['Stephen King'],
      },
    },
  ],
}

describe('useGoogleBooks', () => {
  const originalNavigator = global.navigator
  let consoleWarnSpy: jest.SpyInstance

  beforeEach(() => {
    global.fetch = jest.fn()
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    Object.defineProperty(global, 'navigator', {
      value: { onLine: true },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    })
  })

  test('initial state', () => {
    const { result } = renderHook(() => useGoogleBooks())

    expect(result.current.books).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.hasMore).toBe(true)
  })

  test('fetches mock data', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    })

    const { result } = renderHook(() => useGoogleBooks())

    act(() => {
      result.current.searchBooks('Holly', 20)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.books).toHaveLength(1)
    expect(result.current.books[0].title).toBe('Holly')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('q=Holly'),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    )
  })

  test('empty request', () => {
    const { result } = renderHook(() => useGoogleBooks())

    act(() => {
      result.current.searchBooks('')
    })

    expect(global.fetch).toHaveBeenCalledTimes(0)
    expect(result.current.loading).toBe(false)
  })

  test('throws error in offline', () => {
    Object.defineProperty(global, 'navigator', {
      value: { onLine: false },
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useGoogleBooks())

    act(() => {
      result.current.searchBooks('Holly')
    })

    expect(global.fetch).toHaveBeenCalledTimes(0)
    expect(result.current.error).toBe('common.offlineError')
  })

  test('throws timeout error', async () => {
    jest.useFakeTimers()

    global.fetch = jest.fn(() => new Promise(() => {}))

    const { result } = renderHook(() => useGoogleBooks())

    act(() => {
      result.current.searchBooks('test', 20)
    })

    act(() => {
      jest.advanceTimersByTime(10000)
    })

    expect(result.current.error).toBe('common.requestTimeout')
    expect(result.current.loading).toBe(false)

    jest.useRealTimers()
  })

  test('throws HTTP error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    })

    const { result } = renderHook(() => useGoogleBooks())

    act(() => {
      result.current.searchBooks('test', 10)
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('HTTP error! status: 500')
  })

  test('clears books', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    })

    const { result } = renderHook(() => useGoogleBooks())

    act(() => {
      result.current.searchBooks('Holly')
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.books).toHaveLength(1)
    expect(result.current.error).toBeNull()

    act(() => {
      result.current.clearBooks()
    })

    expect(result.current.books).toHaveLength(0)
    expect(result.current.error).toBeNull()
    expect(result.current.hasMore).toBe(true)
  })

  test('getBookById returns book', async () => {
    const mockBookData = {
      id: '123',
      volumeInfo: {
        title: 'Test Book',
        authors: ['Test Author'],
        description: 'Test description',
        publishedDate: '2023-01-01',
        publisher: 'Test Publisher',
        pageCount: 300,
        averageRating: 4.5,
        ratingsCount: 100,
        categories: ['Fiction'],
        language: 'en',
        previewLink: 'http://preview.com',
        infoLink: 'http://info.com',
        imageLinks: {
          thumbnail: 'http://cover.jpg',
        },
      },
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBookData,
    })

    const { result } = renderHook(() => useGoogleBooks())

    let book = null

    await act(async () => {
      book = await result.current.getBookById('123')
    })

    expect(book).not.toBeNull()
    expect(book!.title).toBe('Test Book') // Erorr with "?.": Property 'title' does not exist on type 'never'.
    expect(book!.authors).toEqual(['Test Author']) // Error with "?.": Property 'authors' does not exist on type 'never'.
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/volumes/123?key='),
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    )
  })

  test('getBookById returns null on 404', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

    const { result } = renderHook(() => useGoogleBooks())

    let book = null

    await act(async () => {
      book = await result.current.getBookById('999')
    })

    expect(book).toBeNull()
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  test('getBookById returns null when no volumeInfo', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1337' }),
    })

    const { result } = renderHook(() => useGoogleBooks())

    let book = null

    await act(async () => {
      book = await result.current.getBookById('1337')
    })

    expect(book).toBeNull()
  })

  test('getBookById retries without API key on first failure', async () => {
    const mockBookData = {
      id: '1201',
      volumeInfo: {
        title: 'Joyland',
        authors: ['Stephen King'],
      },
    }

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
      })
      .mockResolvedValue({
        ok: true,
        json: async () => mockBookData,
      })

    const { result } = renderHook(() => useGoogleBooks())

    let book = null

    await act(async () => {
      book = await result.current.getBookById('1201')
    })

    expect(book).not.toBeNull()
    expect(book!.title).toBe('Joyland')
    expect(book!.authors).toEqual(['Stephen King'])
    expect(global.fetch).toHaveBeenCalledTimes(2)

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      'https://www.googleapis.com/books/v1/volumes/1201?key=test-key',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    )

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'https://www.googleapis.com/books/v1/volumes/1201',
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    )
  })
})
