"use client";

import {
  BackHeader,
  Button,
  Input,
  Label,
  Radio,
  Select,
  Textarea,
} from "@/components";
import { useState } from "react";

const areaOptions = [
  { label: "Mumbai", value: "mumbai" },
  { label: "Banglore", value: "banglore" },
  { label: "Delhi", value: "delhi" },
];

const machines = [
  { label: "VM-101", value: "vm101" },
  { label: "VM-214", value: "vm214" },
  { label: "VM-332", value: "vm332" },
  { label: "VM-457", value: "vm457" },
  { label: "VM-629", value: "vm629" },
];

const CreateRoute = () => {
  const [area, setArea] = useState("");
  const [machine, setMachine] = useState("");
  const [status, setStatus] = useState("");

  return (
    <div className="min-h-full p-4">
      <BackHeader title="Create Route" />
      <div className="bg-white rounded-xl w-full">
        <div className="p-10 grid grid-cols-2 gap-8">
          <div>
            <Input
              label="Route Name"
              variant="orange"
              placeholder="Enter Route Name"
              className="w-full"
            />
            <div className="mt-8">
              <Select
                label="Choose Area"
                placeholder="Select Area"
                selectClassName="py-4 px-4"
                variant="orange"
                value={area}
                onChange={setArea}
                options={areaOptions}
              />
            </div>
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
            <div className="mt-10">
              <div>
                <Label className="text-xl">Frequency Type</Label>
              </div>
              <div className="my-4">
                <Radio
                  label="Daily"
                  value="daily"
                  selectedValue={status}
                  onChange={setStatus}
                />
              </div>
              <div className="my-4">
                <Radio
                  label="Weekly"
                  value="weekly"
                  selectedValue={status}
                  onChange={setStatus}
                />
              </div>
              <div className="my-4">
                <Radio
                  label="Custom"
                  value="custom"
                  selectedValue={status}
                  onChange={setStatus}
                />
              </div>
            </div>
          </div>
          <div>
            <Textarea
              label="Optional Notes"
              variant="orange"
              placeholder="Enter Notes..."
              className="h-40 w-full"
              rows={7}
            />
          </div>
        </div>
        <div className="flex justify-center pb-8">
          <Button className="rounded-lg px-8">Save Route</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoute;
