import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface QuickNavState {
  state: boolean
  setState: (payload: boolean) => void
}

const useQuickNavStore = create<QuickNavState>()(
  subscribeWithSelector(set => ({
    state: true,
    setState: payload => set(() => ({ state: payload })),
  }))
)

export default useQuickNavStore
