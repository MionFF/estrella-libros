import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { enableMapSet } from 'immer'

process.env.VITE_GOOGLE_BOOKS_API_KEY = 'test-key'

// Включаем поддержку Set/Map в Immer
enableMapSet()

// Глобальный мок для react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}))

// Фикс TextEncoder для react-router-dom
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder
