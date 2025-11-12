"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loginUser,
  registerUser,
  logoutUser,
  clearError,
} from "../store/slices/authSlice";
import { authUtils } from "../utils";
import type { LoginCredentials, RegisterData } from "../types";

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token, isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const token = authUtils.isAuthenticated();
    if (!token && isAuthenticated) {
      dispatch(logoutUser());
    }
  }, [dispatch, isAuthenticated]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(result)) {
        router.push("/admin");
        return { success: true };
      }
      return { success: false, error: result.payload };
    } catch {
      return { success: false, error: "Login failed" };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const result = await dispatch(registerUser(userData));
      if (registerUser.fulfilled.match(result)) {
        router.push("/admin");
        return { success: true };
      }
      return { success: false, error: result.payload };
    } catch {
      return { success: false, error: "Registration failed" };
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser());
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    clearAuthError,
  };
};
