import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import { authMiddleware, apiMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .prepend(authMiddleware.middleware)
    .prepend(apiMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;