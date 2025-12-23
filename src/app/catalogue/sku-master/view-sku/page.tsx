"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BackHeader, Label, Button } from "@/components";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin/api.config";

type ProductImage = {
  image_name: string;
  file_url: string;
  cloudinary_public_id: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  _id: string;
};

type CatalogueData = {
  id: string;
  sku_id: string;
  product_name: string;
  brand_name: string;
  description: string;
  category: string;
  sub_category: string;
  manufacturer_name: string;
  manufacturer_address: string;
  shell_life: string;
  expiry_alert_threshold: number;
  tages_label: string;
  unit_size: string;
  base_price: number;
  final_price: number;
  barcode: string;
  nutrition_information: string;
  ingredients: string;
  product_images: ProductImage[];
  status: string;
  createdAt: string;
  updatedAt?: string;
};

export default function ViewSkuPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [skuData, setSkuData] = useState<CatalogueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalogueData = async () => {
      if (!id) {
        setError("No catalogue ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get(
          apiConfig.endpoints.catalogue.catalogueById(id)
        );

        if (response.data.success) {
          setSkuData(response.data.data);
        }
      } catch (err: any) {
        console.error("Error fetching catalogue:", err);
        setError("Failed to load catalogue details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogueData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading catalogue details...</div>
      </div>
    );
  }

  if (error || !skuData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <BackHeader title="View SKU" />
        <div className="max-w-full mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm p-10">
            <div className="text-center">
              <p className="text-xl text-red-600 mb-6">{error || "Catalogue not found"}</p>
              <Button
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <BackHeader title={`View SKU - ${skuData.sku_id}`} />

      <div className="max-w-full mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-sm p-10 space-y-8">
          {/* Header Section */}
          <div className="border-b pb-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {skuData.product_name}
            </h1>
            <div className="flex items-center gap-6 text-lg">
              <span className="text-gray-600 font-semibold">
                {skuData.brand_name}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-lg font-semibold ${
                  skuData.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {skuData.status === "active" ? "Active" : "Inactive"}
              </span>
              <span className="text-gray-500">ID: {skuData.sku_id}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
              <span>Created: {formatDate(skuData.createdAt)}</span>
              {skuData.updatedAt && <span>Updated: {formatDate(skuData.updatedAt)}</span>}
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
                        {skuData.sub_category}
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
                      {skuData.manufacturer_name}
                    </p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <Label className="text-sm font-medium text-gray-600 mb-1 block">
                      Address
                    </Label>
                    <p className="text-lg text-gray-700">
                      {skuData.manufacturer_address}
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
                      Unit Size
                    </Label>
                    <p className="text-xl font-bold text-gray-900">
                      {skuData.unit_size}
                    </p>
                  </div>
                  <div className="p-5 border-l-4 border-blue-400 bg-blue-50 rounded-xl">
                    <Label className="text-sm font-medium text-gray-600 mb-1 block">
                      Shell Life
                    </Label>
                    <p className="text-xl font-bold text-gray-900">
                      {skuData.shell_life}
                    </p>
                  </div>
                  <div className="p-5 border-l-4 border-purple-400 bg-purple-50 rounded-xl">
                    <Label className="text-sm font-medium text-gray-600 mb-1 block">
                      Expiry Alert Threshold
                    </Label>
                    <p className="text-xl font-bold text-gray-900">
                      {skuData.expiry_alert_threshold} days
                    </p>
                  </div>
                  <div className="p-5 border-l-4 border-pink-400 bg-pink-50 rounded-xl">
                    <Label className="text-sm font-medium text-gray-600 mb-1 block">
                      Tags / Label
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {skuData.tages_label.split(",").map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Pricing
                </h3>
                <div className="space-y-4">
                  <div className="p-6 bg-linear-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-gray-600">
                        Base Price
                      </Label>
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{skuData.base_price}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium text-gray-600">
                        Final Price
                      </Label>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{skuData.final_price}
                      </p>
                    </div>
                    {skuData.final_price < skuData.base_price && (
                      <p className="text-sm text-green-700 font-semibold mt-1">
                        Save ₹{(skuData.base_price - skuData.final_price).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          {skuData.product_images && skuData.product_images.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Product Images
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skuData.product_images.map((image, idx) => (
                  <div
                    key={image._id}
                    className="bg-white rounded-xl border-2 border-gray-200 hover:border-orange-400 transition-all duration-200"
                  >
                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-6">
                      <img
                        src={image.file_url}
                        alt={image.image_name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          console.error('Image failed to load:', image.file_url);
                          e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="gray">No Image</text></svg>';
                        }}
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.image_name}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{(image.file_size / 1024).toFixed(1)} KB</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {image.mime_type.split("/")[1].toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Media & Details */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Product Media & Details
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="p-6 bg-gray-100 rounded-xl text-center">
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Barcode / EAN / UPC
                  </Label>
                  <div className="bg-white p-5 rounded-xl font-mono font-bold text-2xl text-gray-900 border-2 border-gray-300">
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
                    {skuData.nutrition_information}
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
