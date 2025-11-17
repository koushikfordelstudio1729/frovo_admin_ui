import { createListenerMiddleware } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser, setCredentials } from '../slices/authSlice';
import { storageUtils } from '../../utils';

export const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  actionCreator: loginUser.fulfilled,
  effect: (action) => {
    const { user, accessToken, refreshToken } = action.payload.data;
    storageUtils.setToken(accessToken);
    storageUtils.setRefreshToken(refreshToken);
    storageUtils.setUser(user);
  },
});

authMiddleware.startListening({
  actionCreator: registerUser.fulfilled,
  effect: (action) => {
    const { user, accessToken, refreshToken } = action.payload.data;
    storageUtils.setToken(accessToken);
    storageUtils.setRefreshToken(refreshToken);
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
    const { user, accessToken, refreshToken } = action.payload;
    if (accessToken) storageUtils.setToken(accessToken);
    if (refreshToken) storageUtils.setRefreshToken(refreshToken);
    if (user) storageUtils.setUser(user);
  },
});