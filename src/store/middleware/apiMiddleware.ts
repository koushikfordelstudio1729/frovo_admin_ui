import { createListenerMiddleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { logoutUser } from '../slices/authSlice';
import { HTTP_STATUS } from '../../utils/constants';

export const apiMiddleware = createListenerMiddleware();

apiMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: (action, listenerApi) => {
    const error = action.payload as { status?: number; message?: string };
    
    if (error?.status === HTTP_STATUS.UNAUTHORIZED) {
      listenerApi.dispatch(logoutUser());
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    if (error?.status === HTTP_STATUS.FORBIDDEN) {
      console.warn('Access forbidden:', error.message);
    }

    if (error?.status && error.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      console.error('Server error:', error.message);
    }

    if (!navigator.onLine) {
      console.error('Network error: You are offline');
    }
  },
});