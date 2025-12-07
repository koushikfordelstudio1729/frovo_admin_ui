"use client";

import {
  BackHeader,
  Button,
  Input,
  Label,
  Select,
  Textarea,
  Toggle,
} from "@/components";
import { useState } from "react";

const machines = [
  { label: "VM-101", value: "vm101" },
  { label: "VM-214", value: "vm214" },
  { label: "VM-332", value: "vm332" },
  { label: "VM-457", value: "vm457" },
  { label: "VM-629", value: "vm629" },
];

const CreateArea = () => {
  const [machine, setMachine] = useState("");
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="min-h-screen p-4">
      <BackHeader title="Create Area" />
      <div className="bg-white rounded-xl w-full">
        <div className="p-10 grid grid-cols-2 gap-8">
          <div>
            <Input
              label="Area Name"
              variant="orange"
              placeholder="Enter Area Name"
              className="w-full"
            />

            <div className="mt-8">
              <Select
                label="Select Machines"
                placeholder="Select machines"
                selectClassName="py-4 px-4"
                variant="orange"
                value={machine}
                onChange={setMachine}
                options={machines}
              />
            </div>
          </div>
          <div>
            <Textarea
              label="Area Description"
              variant="orange"
              placeholder="Enter Area Description"
              className="h-40 w-full"
              rows={7}
            />
          </div>
          <div className="mt-4">
            <div className="mb-2">
              <Label>Status</Label>
            </div>
            <Toggle
              enabled={isActive}
              onChange={setIsActive}
              label="Active / Inactive"
            />
          </div>
        </div>
        <div className="flex justify-center pb-12">
          <Button className="px-12 rounded-lg" variant="primary">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateArea;
