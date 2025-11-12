"use client";

import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUp() {
  return (
    <SignUpForm
      redirectPath="/warehouse/dashboard"
      loginLink="/warehouse/login"
    />
  );
}
