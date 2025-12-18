"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BackHeader, Label, Button } from "@/components";

export default function ViewSkuPage() {
  const router = useRouter();

  // Complete dummy data matching ALL CreateSkuPage fields
  const skuData = {
    skuId: "SKU-001",
    productName: "Amul Toned Milk",
    brandName: "Amul",
    description:
      "Rich and creamy toned milk sourced from farms across Gujarat.",
    category: "Dairy",
    subCategory: "Milk",
    manufacturerName: "Amul India Ltd.",
    manufacturerAddress: "Amul Dairy Road, Anand, Gujarat 388001, India",
    unitSizeStock: "1L",
    storageType: "Refrigerated",
    tagLabel: "Best Seller",
    uom: "Litre",
    basePrice: "₹60",
    dealPrice: "₹55",
    barcode: "8901234567890",
    nutrition:
      "Per 100ml: Energy 65 kcal, Protein 3.2g, Carbohydrate 4.8g, Fat 3.5g, Calcium 120mg.",
    ingredients: "Toned milk, Vitamin A & D (added), permitted stabilizers.",
    isActive: true,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <BackHeader title={`View SKU - ${skuData.skuId}`} />

      <div className="max-w-full mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-sm p-10 space-y-8">
          {/* Header Section */}
          <div className="border-b pb-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {skuData.productName}
            </h1>
            <div className="flex items-center gap-6 text-lg">
              <span className="text-gray-600 font-semibold">
                {skuData.brandName}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-lg font-semibold ${
                  skuData.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {skuData.isActive ? "Active" : "Inactive"}
              </span>
              <span className="text-gray-500">ID: {skuData.skuId}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {skuData.description}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Category
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-2 block">
                      Main Category
                    </Label>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-lg font-semibold text-gray-900">
                        {skuData.category}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600 mb-2 block">
                      Sub Category
                    </Label>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-lg font-semibold text-gray-900">
                        {skuData.subCategory}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manufacturer */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Manufacturer
                </h3>
                <div className="space-y-4">
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <Label className="text-sm font-medium text-gray-600 mb-1 block">
                      Name
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">
                      {skuData.manufacturerName}
                    </p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <Label className="text-sm font-medium text-gray-600 mb-1 block">
                      Address
                    </Label>
                    <p className="text-lg text-gray-700">
                      {skuData.manufacturerAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Product Specifications */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-5 border-l-4 border-orange-400 bg-orange-50 rounded-xl">
                    <Label className="text-sm font-medium text-gray-600 mb-1 block">
                      Unit Size (Stock)
                    </Label>
                    <p className="text-xl font-bold text-gray-900">
                      {skuData.unitSizeStock}
                    </p>
                  </div>
                  <div className="p-5 border-l-4 border-blue-400 bg-blue-50 rounded-xl">
                    <Label className="text-sm font-medium text-gray-600 mb-1 block">
                      Storage Type
                    </Label>
                    <p className="text-xl font-bold text-gray-900">
                      {skuData.storageType}
                    </p>
                  </div>
                  <div className="p-5 border-l-4 border-purple-400 bg-purple-50 rounded-xl">
                    <Label className="text-sm font-medium text-gray-600 mb-1 block">
                      Tags / Label
                    </Label>
                    <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-lg font-semibold">
                      {skuData.tagLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Pricing
                </h3>
                <div className="space-y-4">
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-gray-600">
                        Unit Size / UOM
                      </Label>
                      <p className="text-xl font-semibold text-gray-900">
                        {skuData.uom}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-linear-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-gray-600">
                        Base Price
                      </Label>
                      <p className="text-2xl font-bold text-orange-600">
                        {skuData.basePrice}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-gray-600">
                        Deal Price
                      </Label>
                      <p className="text-2xl font-bold text-green-600">
                        {skuData.dealPrice}
                      </p>
                    </div>
                    <p className="text-sm text-green-700 font-semibold mt-1">
                      Save ₹5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Media & Details */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Product Media & Details
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="p-6 bg-linear-to-r from-gray-50 to-gray-100 rounded-xl text-center">
                  <Label className="text-sm font-medium text-gray-600 mb-3 block">
                    Barcode / EAN / UPC
                  </Label>
                  <div className="bg-white p-4 rounded-xl font-mono font-bold text-xl border">
                    {skuData.barcode}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 bg-gray-50 rounded-xl">
                  <Label className="text-lg font-semibold text-gray-900 mb-3 block">
                    Nutritional Information
                  </Label>
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {skuData.nutrition}
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-xl">
                  <Label className="text-lg font-semibold text-gray-900 mb-3 block">
                    Ingredients
                  </Label>
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {skuData.ingredients}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-8 border-t flex justify-center">
            <Button
              className="px-12 py-3 text-lg font-semibold bg-gray-800 hover:bg-gray-900 rounded-xl shadow-lg"
              variant="secondary"
              onClick={() => router.push("/catalogue/sku-master")}
            >
              <ArrowLeft size={20} className="mr-3" />
              Back to SKU List
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
