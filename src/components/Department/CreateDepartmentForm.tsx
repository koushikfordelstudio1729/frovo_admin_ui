import { ArrowLeft, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../common";

export const CreateDepartmentForm = () => {
  const router = useRouter();
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 mt-4">
        <button onClick={() => router.back()} className="text-gray-900 mt-8 ">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-semibold text-gray-900 pt-8">
          Create new department
        </h1>
      </div>
      {/* Form Container */}
      <div className="bg-white rounded-xl p-8 pb-12">
        <div className="flex justify-items-start">
          <div className="w-full max-w-6xl space-y-6 ">
            <div className=" mt-8">
              <div>
                <label className="block text-xl font-medium text-gray-900 mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  className="w-full text-black px-4 py-4 border-2 border-orange-300 rounded-lg focus:outline-none focus:outline-orange-500"
                />
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="block text-xl font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full text-black px-4 py-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:outline-orange-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* Available roles */}
              <div>
                <label className="block text-xl font-medium text-gray-900 mb-2">
                  Available roles
                </label>
                <div className="relative">
                  <select className="w-full text-black  px-4 py-4 border-2 border-orange-300 rounded-lg focus:outline-none focus:outline-orange-500 appearance-none">
                    <option>Select role</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={28}
                  />
                </div>
              </div>
              {/* Add Users */}
              <div>
                <label className="block text-xl font-medium text-gray-900 mb-2">
                  Add users
                </label>
                <input
                  type="text"
                  className="w-full text-black px-4 py-4 border-2 border-orange-300 rounded-lg focus:outline-none focus:outline-orange-500"
                />
              </div>
            </div>
            {/* Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button variant="primary" size="md" className="px-12">
                Save
              </Button>
              <Button variant="secondary" size="md" className="px-12">
                Save draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateDepartmentForm;
