import { createStore, useStore, type StateCreator } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/shallow'

interface FavoritesState {
  ids: Set<string>
  toggle: (id: string) => void
  isFavorite: (id: string) => boolean
  clear: () => void
}

interface Persisted {
  ids: string[]
}

const fromPersist = (p: Persisted): Set<string> => new Set(p.ids ?? [])
const toPersist = (s: FavoritesState): Persisted => ({ ids: Array.from(s.ids) })

const createFavoritesSlice: StateCreator<
  FavoritesState,
  [['zustand/immer', never], ['zustand/devtools', never], ['zustand/persist', unknown]]
> = (set, get) => ({
  ids: new Set<string>(),
  toggle: id =>
    set(state => {
      const next = new Set(state.ids)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return { ids: next }
    }),
  isFavorite: id => get().ids.has(id),
  clear: () => set({ ids: new Set<string>() }),
})

export const favStore = createStore<FavoritesState>()(
  immer(
    devtools(
      persist(createFavoritesSlice, {
        name: 'fav-store',
        storage: createJSONStorage(() => localStorage),
        partialize: state => toPersist(state),
        onRehydrateStorage: () => state => {
          if (!state) return
          // Возвращаем из стора
          const persisted = { ids: Array.from(state.ids) }
          state.ids = fromPersist(persisted)
        },
      }),
    ),
  ),
)

// Selectors
export const useIds = () =>
  useStore(
    favStore,
    useShallow(s => s.ids),
  )
export const useIsFavorite = (id: string) => useStore(favStore, s => s.ids.has(id))

export const toggle = (id: string) => favStore.getState().toggle(id)
export const clear = () => favStore.getState().clear()
