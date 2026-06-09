import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  sidebarCollapsed: boolean
  activeReport:     string | null
}

const initialState: UiState = {
  sidebarCollapsed: false,
  activeReport:     null,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload
    },
    setActiveReport(state, action: PayloadAction<string | null>) {
      state.activeReport = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarCollapsed, setActiveReport } = uiSlice.actions
export default uiSlice.reducer
