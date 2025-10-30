import { createListenerMiddleware } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser, setCredentials } from '../slices/authSlice';
import { storageUtils } from '../../utils';

export const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  actionCreator: loginUser.fulfilled,
  effect: (action) => {
    const { user, token } = action.payload;
    storageUtils.setToken(token);
    storageUtils.setUser(user);
  },
});

authMiddleware.startListening({
  actionCreator: registerUser.fulfilled,
  effect: (action) => {
    const { user, token } = action.payload;
    storageUtils.setToken(token);
    storageUtils.setUser(user);
  },
});

authMiddleware.startListening({
  actionCreator: logoutUser.fulfilled,
  effect: () => {
    storageUtils.clearAuthData();
  },
});

authMiddleware.startListening({
  actionCreator: setCredentials,
  effect: (action) => {
    const { user, token } = action.payload;
    storageUtils.setToken(token);
    storageUtils.setUser(user);
  },
});