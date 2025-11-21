"use client";

import { useState } from "react";
import { Toggle } from "@/components/common/Toggle/Toggle";
import { Button, Input } from "@/components/common";
import { SecuritySettings } from "@/types/security.types";

interface SecuritySettingsFormProps {
  settings: SecuritySettings;
  onChange: (settings: SecuritySettings) => void;
  onSave: (settings: SecuritySettings) => Promise<void> | void;
  isSaving?: boolean;
}

const SecuritySettingsForm: React.FC<SecuritySettingsFormProps> = ({
  settings,
  onChange,
  onSave,
  isSaving = false,
}) => {
  // Local state for new IP range
  const [newIpRange, setNewIpRange] = useState("");

  const toggleMFA = (enabled: boolean) => {
    onChange({ ...settings, mfaEnabled: enabled });
  };

  const addIPRange = () => {
    if (!newIpRange.trim()) return;
    const newRange = { id: Date.now().toString(), range: newIpRange };
    onChange({
      ...settings,
      ipAllowlist: [...settings.ipAllowlist, newRange],
    });
    setNewIpRange("");
  };

  const removeIPRange = (id: string) => {
    onChange({
      ...settings,
      ipAllowlist: settings.ipAllowlist.filter((ip) => ip.id !== id),
    });
  };

  const handleSSOChange = (field: keyof typeof settings.sso, value: string) => {
    onChange({
      ...settings,
      sso: { ...settings.sso, [field]: value },
    });
  };

  const handleSave = async () => {
    await onSave(settings);
  };

  return (
    <div>
      <div className="space-y-8">
        {/* MFA Enforcement */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4">MFA Enforcement</h2>
          <Toggle
            enabled={settings.mfaEnabled}
            onChange={toggleMFA}
            label="Enable / Disable"
          />
        </div>

        {/* IP Allowlist */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4">IP Allowlist</h2>
          {settings.ipAllowlist.length > 0 && (
            <div className="space-y-3 mb-4 max-w-sm">
              {settings.ipAllowlist.map((ip) => (
                <div
                  key={ip.id}
                  className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="text-black text-sm">{ip.range}</span>
                  <button
                    type="button"
                    onClick={() => removeIPRange(ip.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-3 max-w-sm">
            <Input
              variant="default"
              value={newIpRange}
              onChange={(e) => setNewIpRange(e.target.value)}
              placeholder="192.168.0.0/24"
              inputClassName="bg-gray-50"
            />
            <Button
              onClick={addIPRange}
              variant="primary"
              className="px-6 rounded-lg"
            >
              + Add IP range
            </Button>
          </div>
        </div>
        <div className="w-full h-px bg-gray-300"></div>
        {/* SSO Setup */}
        <div>
          <h2 className="text-xl font-bold text-black mb-6">SSO Setup</h2>
          <div className="space-y-6 max-w-md">
            <Input
              label="Client ID"
              variant="default"
              value={settings.sso.clientId}
              onChange={(e) => handleSSOChange("clientId", e.target.value)}
              placeholder="Enter Client ID"
              inputClassName="bg-gray-50"
              labelClassName="text-sm font-medium text-gray-700"
            />
            <Input
              label="Secret"
              type="password"
              variant="default"
              value={settings.sso.secret}
              onChange={(e) => handleSSOChange("secret", e.target.value)}
              placeholder="Enter Secret"
              inputClassName="bg-gray-50"
              labelClassName="text-sm font-medium text-gray-700"
            />
            <Input
              label="Metadata URL"
              type="url"
              variant="default"
              value={settings.sso.metadataUrl}
              onChange={(e) => handleSSOChange("metadataUrl", e.target.value)}
              placeholder="Enter Metadata URL"
              inputClassName="bg-gray-50"
              labelClassName="text-sm font-medium text-gray-700"
            />
          </div>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-center pt-10 pb-6">
        <Button
          type="button"
          size="md"
          onClick={handleSave}
          variant="primary"
          disabled={isSaving}
          className="px-8 rounded-lg"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettingsForm;
