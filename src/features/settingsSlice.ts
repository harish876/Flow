// src/features/settingsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface SettingsState {
  aiMode: boolean
  timeout: string // e.g. "2", "5", "10" or "2 minutes" etc.
}

const initialState: SettingsState = {
  aiMode: false,
  timeout: "2", // default "2" minutes, for example
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleAiMode: (state) => {
      state.aiMode = !state.aiMode
    },
    setAiMode: (state, action: PayloadAction<boolean>) => {
      state.aiMode = action.payload
    },
    setTimeoutValue: (state, action: PayloadAction<string>) => {
      state.timeout = action.payload
    },
  },
})

export const { toggleAiMode, setAiMode, setTimeoutValue } = settingsSlice.actions
export const settingsReducer = settingsSlice.reducer
