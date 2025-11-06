"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/forms/AuthForm/AuthForm";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // API call here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/admin");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      name: "email",
      type: "email",
      label: "Username",
      placeholder: "name@frovo.in",
      value: email,
      onChange: setEmail,
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "••••••••••••••••••",
      value: password,
      onChange: setPassword,
      showPassword,
      togglePassword: () => setShowPassword(!showPassword),
    },
  ];

  return (
    <AuthForm
      title="Login"
      logoPath="/images/logo.svg"
      fields={fields}
      isLoading={isLoading}
      error={error}
      submitButtonText="Login"
      onSubmit={handleSubmit}
      rememberMe={rememberMe}
      onRememberMeChange={setRememberMe}
      forgotPasswordLink="/login"
      illustration="/images/login_page_vm.png"
      illustrationAlt="Frovo Vending Machine"
    />
  );
}
