"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Label, Select, Button } from "@/components";
import { agents, routes } from "@/config/warehouse";

const GOOGLE_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d789.661602617642!2d-86.8079353!3d33.5092259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88891bc4f27f8377%3A0xc0e1ee3a45d7d60e!2sBirmingham%2C%20AL%2C%20USA!5e0!3m2!1sen!2sin!4v1701252951231!5m2!1sen!2sin";

export default function AssignFieldAgentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    agentName: "",
    routeId: "",
  });

  return (
    <div className="min-h-full bg-gray-50 p-4">
      <div className="flex items-center gap-3 my-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <Label className="text-2xl font-semibold text-gray-900">
          Assign field agent
        </Label>
      </div>
      <div className="max-w-full bg-white rounded-2xl p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* Agent Name */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Agent Name
            </Label>
            <Select
              id="agentName"
              value={formData.agentName}
              options={agents}
              placeholder="Select Agent Name"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(e) =>
                setFormData({ ...formData, agentName: e.target.value })
              }
            />
          </div>
          <div>
            {/* Router ID */}
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Route ID
            </Label>
            <Select
              id="routeId"
              value={formData.routeId}
              options={routes}
              placeholder="Select Router ID"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(e) =>
                setFormData({ ...formData, routeId: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex justify-center mb-10">
          <Button variant="primary" size="lg">
            Confirm Assignment
          </Button>
        </div>
        <div className="rounded-lg overflow-hidden border">
          <iframe
            title="Agent route"
            src={GOOGLE_MAP_EMBED_URL}
            width="100%"
            height="330"
            className="w-full"
            style={{ border: 0 }}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
