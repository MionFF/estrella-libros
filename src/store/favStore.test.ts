import { favStore } from './favStore'

describe('favStore', () => {
  beforeEach(() => {
    favStore.getState().clear()
  })

  test('toggle adds in favorites', () => {
    favStore.getState().toggle('Mr. Mercedes')
    expect(favStore.getState().isFavorite('Mr. Mercedes')).toBe(true)
  })

  test('toggle removes from favorites', () => {
    favStore.getState().toggle('Mr. Mercedes')
    favStore.getState().toggle('Mr. Mercedes')
    expect(favStore.getState().isFavorite('Mr. Mercedes')).toBe(false)
  })

  test('isFavorite works correctly', () => {
    favStore.getState().toggle('Holly')
    expect(favStore.getState().isFavorite('Holly')).toBe(true)
    expect(favStore.getState().isFavorite('The Shining')).toBe(false)
  })

  test('clear works', () => {
    favStore.getState().toggle('Holly')
    favStore.getState().toggle('The Shining')

    favStore.getState().clear()

    expect(favStore.getState().isFavorite('Holly')).toBe(false)
    expect(favStore.getState().isFavorite('The Shining')).toBe(false)
  })
})
