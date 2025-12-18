"use client";

import { useState } from "react";
import SecuritySettingsForm from "@/components/settings/SecuritySettingsForm";
import { SecuritySettings } from "@/types/security.types";
import { DEFAULT_SECURITY_SETTINGS } from "@/utils/constants";

const SecuritySettingsPage = () => {
  const [settings, setSettings] = useState<SecuritySettings>(
    DEFAULT_SECURITY_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (settings: SecuritySettings) => {
    setIsLoading(true);
    try {
      console.log("Saving settings:", settings);
    } catch (err) {
      console.error("Failed to save", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl bg-white p-8 mt-12 mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black mb-3">
            Security Settings
          </h1>
        </div>
        <div className="w-full h-px bg-gray-300 mb-8"></div>
        <SecuritySettingsForm
          settings={settings}
          onChange={setSettings}
          onSave={handleSave}
          isSaving={isLoading}
        />
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
