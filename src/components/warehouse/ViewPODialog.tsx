"use client";

import { X } from "lucide-react";
import Button from "../common/Button";
import Badge from "../common/Badge";
import { format } from "date-fns";
import { useState } from "react";
import type { PurchaseOrder } from "@/types";

interface ViewPODialogProps {
  isOpen: boolean;
  purchaseOrder: PurchaseOrder | null;
  onClose: () => void;
}

export const ViewPODialog = ({
  isOpen,
  purchaseOrder,
  onClose,
}: ViewPODialogProps) => {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>(
    {}
  );

  if (!isOpen || !purchaseOrder) return null;

  const statusVariantMap: Record<string, any> = {
    approved: "approved",
    draft: "inactive",
    received: "approved",
    delivered: "approved",
    pending: "orange",
  };

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
    setImageLoading((prev) => ({ ...prev, [imageId]: false }));
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoading((prev) => ({ ...prev, [imageId]: false }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Purchase Order: {purchaseOrder.po_number}
            </h2>
            <Badge
              variant={statusVariantMap[purchaseOrder.po_status] || "info"}
              label={
                purchaseOrder.po_status.charAt(0).toUpperCase() +
                purchaseOrder.po_status.slice(1)
              }
              size="md"
              showDot={true}
              className="px-3 py-1 text-sm rounded-full"
            />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* PO Information */}
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Purchase Order Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">PO Number</p>
                <p className="font-medium text-gray-900">
                  {purchaseOrder.po_number}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">PO Raised Date</p>
                <p className="font-medium text-gray-900">
                  {format(
                    new Date(purchaseOrder.po_raised_date),
                    "dd MMM yyyy"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created By</p>
                <p className="font-medium text-gray-900">
                  {purchaseOrder.createdBy?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created At</p>
                <p className="font-medium text-gray-900">
                  {format(
                    new Date(purchaseOrder.createdAt),
                    "dd MMM yyyy, HH:mm"
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {format(
                    new Date(purchaseOrder.updatedAt),
                    "dd MMM yyyy, HH:mm"
                  )}
                </p>
              </div>
            </div>
            {purchaseOrder.remarks && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Remarks</p>
                <p className="font-medium text-gray-900">
                  {purchaseOrder.remarks}
                </p>
              </div>
            )}
          </div>

          {/* Vendor Information */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vendor Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Vendor Name</p>
                <p className="font-medium text-gray-900">
                  {purchaseOrder.vendor_details.vendor_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Billing Name</p>
                <p className="font-medium text-gray-900">
                  {purchaseOrder.vendor_details.vendor_billing_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendor ID</p>
                <p className="font-medium text-gray-900">
                  {purchaseOrder.vendor_details.vendor_id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">
                  {purchaseOrder.vendor_details.vendor_email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">
                  {purchaseOrder.vendor_details.vendor_phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">GST Number</p>
                <p className="font-medium text-gray-900">
                  {purchaseOrder.vendor_details.gst_number}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium text-gray-900">
                  {purchaseOrder.vendor_details.vendor_address}
                </p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Line Items ({purchaseOrder.po_line_items.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Line No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expected Delivery
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseOrder.po_line_items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.line_no}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {item.sku}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.productName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity} {item.uom}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        ₹{item.unit_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ₹{(item.quantity * item.unit_price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {format(
                          new Date(item.expected_delivery_date),
                          "dd MMM yyyy"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-3 text-right font-semibold text-gray-900"
                    >
                      Grand Total:
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-gray-900 text-lg">
                      ₹
                      {purchaseOrder.po_line_items
                        .reduce(
                          (sum, item) => sum + item.quantity * item.unit_price,
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Product Images */}
          {purchaseOrder.po_line_items.some(
            (item) => item.images && item.images.length > 0
          ) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Images
              </h3>
              <div className="space-y-6">
                {purchaseOrder.po_line_items.map(
                  (item) =>
                    item.images &&
                    item.images.length > 0 && (
                      <div key={item._id} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Line {item.line_no}: {item.productName} (
                          {item.images.length}{" "}
                          {item.images.length === 1 ? "image" : "images"})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {item.images.map((image) => (
                            <div
                              key={image._id}
                              className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-all hover:shadow-lg"
                              style={{ backgroundColor: "#f9fafb" }}
                            >
                              {image.mime_type.startsWith("image/") ? (
                                imageErrors[image._id] ? (
                                  // Error State
                                  <div className="w-full h-32 flex items-center justify-center">
                                    <div className="text-center p-4">
                                      <svg
                                        className="w-8 h-8 mx-auto text-red-400 mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      <p className="text-xs text-gray-500">
                                        Failed to load
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  // Image
                                  <a
                                    href={image.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                  >
                                    <img
                                      src={image.file_url}
                                      alt={image.file_name}
                                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                      onError={() =>
                                        handleImageError(image._id)
                                      }
                                      style={{ display: "block" }}
                                    />
                                  </a>
                                )
                              ) : (
                                <a
                                  href={image.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-full h-32 items-center justify-center"
                                >
                                  <div className="text-center">
                                    <svg
                                      className="w-8 h-8 mx-auto text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <p className="text-xs text-gray-500 mt-1">
                                      PDF
                                    </p>
                                  </div>
                                </a>
                              )}

                              {/* Info overlay on hover */}
                              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-xs text-white truncate font-medium">
                                  {image.file_name}
                                </p>
                                <p className="text-xs text-gray-200">
                                  {(image.file_size / 1024).toFixed(1)} KB
                                </p>
                              </div>

                              {/* Click indicator */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/90 rounded-full p-1">
                                  <svg
                                    className="w-4 h-4 text-gray-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} className="rounded-lg">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewPODialog;
