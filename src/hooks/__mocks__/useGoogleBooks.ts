export const useGoogleBooks = jest.fn(() => ({
  books: [],
  loading: false,
  error: null,
  searchBooks: jest.fn(),
  clearBooks: jest.fn(),
}))
