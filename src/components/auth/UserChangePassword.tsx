"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserChangePassword() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const checks = useMemo(() => {
    const isLength = newPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNumberOrSpecial = /[0-9\W]/.test(newPassword);
    const confirmMatches = newPassword !== "" && newPassword === confirmPassword;
    const allValid = isLength && hasUpper && hasNumberOrSpecial && confirmMatches;
    return { isLength, hasUpper, hasNumberOrSpecial, confirmMatches, allValid };
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 700));
    router.push("/userprofile");
  };

  function ValidationItem({ ok, text }: { ok: boolean; text: string }) {
    return (
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          style={{
            width: 18,
            height: 18,
            borderRadius: 18,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: ok ? "#16a34a" : "#e6e6e6",
            color: "white",
            flex: "0 0 18px",
            marginTop: 2,
          }}
        >
          ✓
        </div>
        <div style={{ lineHeight: 1.2 }} className={ok ? "text-green-700" : "text-red-600"}>
          {text}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl bg-white p-10 rounded-xl shadow"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Change Password
      </h2>

      {/* Old password */}
      <label className="block text-gray-700 mb-2">Old Password</label>
      <input
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        type="password"
        placeholder="Enter old password"
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 mb-6"
      />

      {/* New password */}
      <label className="block text-gray-700 mb-2">New Password</label>
      <input
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        type="password"
        placeholder="Enter new password"
        className="w-full rounded-lg border border-orange-300 px-4 py-3 text-gray-800 mb-6"
      />

      {/* Confirm password */}
      <label className="block text-gray-700 mb-2">Confirm Password</label>
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        placeholder="Re-enter password"
        className="w-full rounded-lg border border-orange-300 px-4 py-3 text-gray-800 mb-6"
      />

      {/* Validation */}
      <div className="space-y-3 mt-6 mb-6">
        <ValidationItem ok={checks.isLength} text="Password must be at least 8 characters long." />
        <ValidationItem ok={checks.hasUpper} text="Password must contain at least one uppercase letter." />
        <ValidationItem ok={checks.hasNumberOrSpecial} text="Password must contain at least one number or special character." />
        <ValidationItem ok={checks.confirmMatches} text="Confirm password must match new password." />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg text-white font-medium bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600"
      >
        Change Password
      </button>
    </form>
  );
}
