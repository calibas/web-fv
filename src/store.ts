import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice';
import fileReducer from './features/fileSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    file: fileReducer,
  },
});

// For TypeScript usage:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;