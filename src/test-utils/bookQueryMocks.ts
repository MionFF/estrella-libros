import type { Book } from '../features/types'

export type MockBooksSearchQueryResult = {
  data: Book[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  refetch: jest.Mock
}

export function createBooksSearchQueryResult(
  overrides: Partial<MockBooksSearchQueryResult> = {},
): MockBooksSearchQueryResult {
  return {
    data: [],
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  }
}

export type MockBookDetailsQueryResult = {
  data: Book | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  refetch: jest.Mock
}

export function createBookDetailsQueryResult(
  overrides: Partial<MockBookDetailsQueryResult> = {},
): MockBookDetailsQueryResult {
  return {
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  }
}

export type MockFavoriteBookQueryResult = {
  data: Book | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  refetch: jest.Mock
}

export function createFavoriteBookQueryResult(
  overrides: Partial<MockFavoriteBookQueryResult> = {},
): MockFavoriteBookQueryResult {
  return {
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: jest.fn(),
    ...overrides,
  }
}
