"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <LoginForm
      redirectPath="/warehouse/dashboard"
      signupLink="/warehouse/signup"
    />
  );
}
