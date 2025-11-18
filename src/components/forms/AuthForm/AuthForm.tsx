"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/common";

interface AuthFormField {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  showPassword?: boolean;
  togglePassword?: () => void;
}

interface AuthFormProps {
  title?: string;
  logoPath?: string;
  logoAlt?: string;
  fields: AuthFormField[];
  isLoading: boolean;
  error?: string | null;
  submitButtonText: string;
  onSubmit: (e: React.FormEvent) => void;
  rememberMe?: boolean;
  onRememberMeChange?: (checked: boolean) => void;
  forgotPasswordLink?: string;
  illustration?: string;
  illustrationAlt?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  logoPath,
  logoAlt = "Logo",
  fields,
  isLoading,
  error,
  submitButtonText,
  onSubmit,
  rememberMe,
  onRememberMeChange,
  forgotPasswordLink,
  illustration,
  illustrationAlt = "Illustration",
}) => {
  return (
    <div className="min-h-full bg-gray-100 flex">
      {/* Logo  */}
      <div className="absolute top-0 left-35 p-6 mt-4">
        {logoPath && (
          <Image
            src={logoPath}
            alt={logoAlt}
            width={150}
            height={50}
            priority={true}
          />
        )}
      </div>

      {/* Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {field.label}
                </label>

                {field.type === "password" ? (
                  <div className="relative">
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.showPassword ? "text" : "password"}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                      disabled={isLoading}
                      required
                    />
                    {field.togglePassword && (
                      <button
                        type="button"
                        onClick={field.togglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {field.showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    disabled={isLoading}
                    required
                  />
                )}

                {field.error && (
                  <p className="mt-1 text-sm text-red-600">{field.error}</p>
                )}
              </div>
            ))}

            {/* Remember Me & Forgot Password */}
            {(onRememberMeChange || forgotPasswordLink) && (
              <div className="flex items-center justify-between">
                {onRememberMeChange && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe || false}
                      onChange={(e) => onRememberMeChange(e.target.checked)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Remember me
                    </span>
                  </label>
                )}

                {forgotPasswordLink && (
                  <a
                    href={forgotPasswordLink}
                    className="text-sm text-orange-500 hover:text-orange-600"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
              className="bg-[#FF5722] hover:bg-[#F4511E] text-white"
            >
              {submitButtonText}
            </Button>
          </form>
        </div>
      </div>

      {/* Vending Machine  */}
      {illustration && (
        <div className="w-1/2  flex items-center justify-center p-12">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={illustration}
              alt={illustrationAlt}
              width={500}
              height={700}
              priority={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
