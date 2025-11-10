// src/app/settings/security/page.tsx
"use client";

import { useState } from "react";
import { Toggle } from "@/components/common/Toggle/Toggle";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import { SecuritySettings } from "@/types/security.types";
import { DEFAULT_SECURITY_SETTINGS } from "@/utils/constants";

const SecuritySettingsPage = () => {
  const [settings, setSettings] = useState<SecuritySettings>(
    DEFAULT_SECURITY_SETTINGS
  );
  const [newIpRange, setNewIpRange] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleMFA = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, mfaEnabled: enabled }));
  };

  const addIPRange = () => {
    if (!newIpRange.trim()) return;

    const newRange = {
      id: Date.now().toString(),
      range: newIpRange,
    };

    setSettings((prev) => ({
      ...prev,
      ipAllowlist: [...prev.ipAllowlist, newRange],
    }));
    setNewIpRange("");
  };

  const removeIPRange = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      ipAllowlist: prev.ipAllowlist.filter((ip) => ip.id !== id),
    }));
  };

  const handleSSOChange = (field: keyof typeof settings.sso, value: string) => {
    setSettings((prev) => ({
      ...prev,
      sso: {
        ...prev.sso,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to save settings
      console.log("Saving settings:", settings);

      // Log event in audit system
      console.log("Audit Log: Security settings updated");
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screens">
      <div className="max-w-7xl bg-white p-8 mt-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-3">
            Security Settings
          </h1>
        </div>
        <div className="w-full h-px bg-gray-300"></div>

        <div className="space-y-8 mt-6">
          {/* MFA Enforcement */}
          <div>
            <h2 className="text-xl font-bold text-black mb-2">
              MFA Enforcement
            </h2>

            <Toggle
              enabled={settings.mfaEnabled}
              onChange={toggleMFA}
              label="Enable / Disable"
            />
          </div>

          {/* IP Allowlist */}
          <div>
            <h2 className="text-xl font-bold text-black mb-2">IP Allowlist</h2>

            {settings.ipAllowlist.length > 0 && (
              <div className="space-y-3 mb-4 w-md">
                {settings.ipAllowlist.map((ip) => (
                  <div
                    key={ip.id}
                    className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="text-black text-sm">{ip.range}</span>
                    <button
                      onClick={() => removeIPRange(ip.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6">
              <Input
                type="text"
                value={newIpRange}
                onChange={(e) => setNewIpRange(e.target.value)}
                placeholder="192.168.0.0/24"
                fullWidth={false}
                inputClassName="text-gray-500"
              />
              <Button onClick={addIPRange} variant="primary" className="px-6">
                + Add IP range
              </Button>
            </div>
          </div>

          <div className="w-full h-px bg-gray-300"></div>

          {/* SSO Setup */}
          <div>
            <h2 className="text-xl font-bold text-black mb-2">SSO Setup</h2>

            <div className="space-y-6">
              <Input
                label="Client ID"
                type="text"
                value={settings.sso.clientId}
                onChange={(e) => handleSSOChange("clientId", e.target.value)}
                placeholder="Enter Client ID"
                fullWidth={false}
                inputClassName="text-gray-500"
              />

              <Input
                label="Secret"
                type="password"
                value={settings.sso.secret}
                onChange={(e) => handleSSOChange("secret", e.target.value)}
                placeholder="Enter Secret"
                fullWidth={false}
                inputClassName="text-gray-500"
              />

              <Input
                label="Metadata URL"
                type="url"
                value={settings.sso.metadataUrl}
                onChange={(e) => handleSSOChange("metadataUrl", e.target.value)}
                placeholder="Enter Metadata URL"
                fullWidth={false}
                inputClassName="text-gray-500 "
              />
            </div>
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-center pt-8 pb-6">
        <Button
          onClick={handleSave}
          variant="primary"
          disabled={isLoading}
          className="px-6"
        >
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
