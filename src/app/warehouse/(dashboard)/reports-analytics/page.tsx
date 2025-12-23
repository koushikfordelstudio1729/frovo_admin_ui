"use client";

import { useState, useEffect } from "react";
import { Button, Select, Input, Label } from "@/components";
import {
  Archive,
  ShoppingCart,
  Timer,
  Truck,
  Tags,
  Box,
  Calendar,
  ThumbsUp,
  BarChart,
  Download,
} from "lucide-react";
import StatCard from "@/components/common/StatCard";
import InventorySummaryTable from "@/components/tables/InventorySummaryTable ";
import PurchaseOrderTable from "@/components/tables/PurchaseOrderTable ";
import VendorPerformanceTable from "@/components/tables/VendorPerformanceTable ";
import MachineStockTable from "@/components/tables/MachineStockTable ";
import RefillSummaryTable from "@/components/tables/RefillSummaryTable ";
import { useMyWarehouse } from "@/hooks/warehouse";
import { warehouseAPI } from "@/services/warehouseAPI";
import { toast } from "react-hot-toast";

const dataOptions = [
  { label: "Inventory Summary", value: "inventory_summary" },
  { label: "Purchase Orders", value: "purchase_orders" },
  { label: "Inventory Turnover", value: "inventory_turnover" },
  { label: "QC Summary", value: "qc_summary" },
  { label: "Efficiency", value: "efficiency" },
  { label: "Stock Ageing", value: "stock_ageing" },
];

export default function ReportsAnalyticsPage() {
  const { warehouse, loading: warehouseLoading } = useMyWarehouse();

  const [dataType, setDataType] = useState("inventory_summary");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch report data when dataType or warehouse changes
  useEffect(() => {
    if (!warehouse?._id || !dataType) return;

    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await warehouseAPI.getGenericReport(
          dataType,
          warehouse._id
        );
        const apiResponse = response.data;

        if (apiResponse.success) {
          setReportData(apiResponse.data);
        }
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dataType, warehouse?._id]);

  // Export report
  const handleExportReport = async (format: "csv" | "json") => {
    if (!dataType) {
      toast.error("Please select a data type first");
      return;
    }

    if (!warehouse?._id) {
      toast.error("No warehouse selected");
      return;
    }

    try {
      setExporting(true);

      const response = await warehouseAPI.exportReport(
        dataType,
        format,
        warehouse._id
      );

      if (format === "csv") {
        // Create a blob from the response and download it
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${dataType}_${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // For JSON, create a downloadable file
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${dataType}_${new Date().toISOString().split("T")[0]}.json`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error: any) {
      console.error("Error exporting report:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to export report";
      toast.error(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  // Get metrics from report data
  const getMetrics = () => {
    if (!reportData) {
      return {
        totalSKUs: 0,
        totalPOs: 0,
        pending: 0,
        stockOutSKUs: 0,
        pendingPOs: 0,
        completedRefills: 0,
        totalStockValue: 0,
        lowStockItems: 0,
        nearExpirySKUs: 0,
        stockAccuracy: 0,
      };
    }

    if (dataType === "inventory_summary" && reportData.summary) {
      return {
        totalSKUs: reportData.summary.totalSKUs || 0,
        totalPOs: reportData.summary.totalPOs || 0,
        pending: reportData.summary.pendingRefills || 0,
        stockOutSKUs: reportData.summary.stockOutSKUs || 0,
        pendingPOs: reportData.summary.pendingPOs || 0,
        completedRefills: reportData.summary.completedRefills || 0,
        totalStockValue: reportData.summary.totalStockValue || 0,
        lowStockItems: reportData.summary.lowStockItems || 0,
        nearExpirySKUs: reportData.summary.nearExpirySKUs || 0,
        stockAccuracy: reportData.summary.stockAccuracy || 0,
      };
    }

    if (dataType === "purchase_orders" && reportData.summary) {
      return {
        totalSKUs: 0,
        totalPOs: reportData.summary.totalPOs || 0,
        pending: 0,
        stockOutSKUs: 0,
        pendingPOs: reportData.summary.pendingPOs || 0,
        completedRefills: 0,
        totalStockValue: reportData.summary.totalPOValue || 0,
        lowStockItems: 0,
        nearExpirySKUs: 0,
        stockAccuracy: 0,
      };
    }

    return {
      totalSKUs: 0,
      totalPOs: 0,
      pending: 0,
      stockOutSKUs: 0,
      pendingPOs: 0,
      completedRefills: 0,
      totalStockValue: 0,
      lowStockItems: 0,
      nearExpirySKUs: 0,
      stockAccuracy: 0,
    };
  };

  const metrics = getMetrics();

  if (warehouseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading warehouse...</p>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            <strong>Error:</strong> No warehouse assigned to your account
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Warehouse Info Card */}
      <div className="bg-linear-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-orange-900">
              Viewing reports for:
            </p>
            <p className="text-lg font-bold text-orange-950">
              {warehouse.name}
            </p>
            <p className="text-xs text-orange-700">Code: {warehouse.code}</p>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between my-4">
        {/* Select data */}
        <div>
          <Label className="block text-base text-black font-medium mb-2">
            Select Report Type
          </Label>
          <Select
            id="data"
            variant="default"
            value={dataType}
            options={dataOptions}
            selectClassName="py-3 px-4 text-sm bg-white"
            onChange={setDataType}
          />
        </div>
        {/* Export buttons */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="rounded-lg flex gap-2 px-6"
            onClick={() => handleExportReport("csv")}
            disabled={exporting || !reportData}
          >
            <Download size={18} />
            Export CSV
          </Button>
          <Button
            variant="primary"
            className="rounded-lg flex gap-2 px-6"
            onClick={() => handleExportReport("json")}
            disabled={exporting || !reportData}
          >
            <Download size={18} />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-6 text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading report data...</p>
        </div>
      )}

      {/* Stat Cards */}
      {!loading && reportData && (
        <>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <StatCard
              className="rounded-b-none"
              title="Total SKUs"
              count={metrics.totalSKUs.toString()}
              icon={Archive}
            />
            <StatCard
              className="rounded-b-none"
              title="Total PO's"
              count={metrics.totalPOs.toString()}
              icon={ShoppingCart}
            />
            <StatCard
              className="rounded-b-none"
              title="Pending"
              count={metrics.pending.toString()}
              icon={Timer}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <StatCard
              className="rounded-t-none"
              title="Stock-Out SKUs"
              count={metrics.stockOutSKUs.toString()}
              icon={Truck}
            />
            <StatCard
              className="rounded-t-none"
              title="Pending POs"
              count={metrics.pendingPOs.toString()}
              icon={Timer}
            />
            <StatCard
              className="rounded-t-none"
              title="Completed Refills"
              count={metrics.completedRefills.toString()}
              icon={ThumbsUp}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="Total Stock Value"
              count={`₹${metrics.totalStockValue.toLocaleString()}`}
              icon={Tags}
            />
            <StatCard
              title="Low Stock Items"
              count={metrics.lowStockItems.toString()}
              icon={Box}
            />
            <StatCard
              title="Near-Expiry SKUs"
              count={metrics.nearExpirySKUs.toString()}
              icon={Calendar}
            />
            <StatCard
              title="Stock Accuracy"
              count={`${metrics.stockAccuracy}%`}
              icon={BarChart}
            />
          </div>
        </>
      )}

      {/* Conditional render tables */}
      <div className="mt-8">
        {dataType === "inventory_summary" && (
          <InventorySummaryTable reportData={reportData} />
        )}
        {dataType === "purchase_orders" && (
          <PurchaseOrderTable reportData={reportData} />
        )}
        {dataType === "inventory_turnover" && (
          <div className="mt-8">
            <div className="text-lg text-gray-700 font-semibold mb-2">
              Inventory Turnover
            </div>
            {reportData?.data && reportData.data.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Current Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Received
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Turnover Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.data.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.currentQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.totalReceived}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.turnoverRate.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  No inventory turnover data found
                </p>
              </div>
            )}
          </div>
        )}
        {dataType === "qc_summary" && (
          <div className="mt-8">
            <div className="text-lg text-gray-700 font-semibold mb-2">
              QC Summary
            </div>
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                QC Summary data available in summary cards above
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Total Receivings: {reportData?.summary?.totalReceivings || 0}
              </p>
            </div>
          </div>
        )}
        {dataType === "efficiency" && (
          <div className="mt-8">
            <div className="text-lg text-gray-700 font-semibold mb-2">
              Efficiency Report
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Overall Score
                </h3>
                <p className="text-4xl font-bold text-blue-600">
                  {reportData?.overallScore || 0}%
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Inventory Efficiency
                </h3>
                <p className="text-sm text-gray-600">
                  Avg Utilization:{" "}
                  <span className="font-semibold">
                    {(
                      (reportData?.inventoryEfficiency?.avgUtilization || 0) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Total Items:{" "}
                  <span className="font-semibold">
                    {reportData?.inventoryEfficiency?.totalItems || 0}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
        {dataType === "stock_ageing" && (
          <div className="mt-8">
            <div className="text-lg text-gray-700 font-semibold mb-2">
              Stock Ageing Distribution
            </div>
            {reportData?.ageingBuckets && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <p className="text-sm font-medium text-green-900">
                    0-30 days
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {reportData.ageingBuckets["0-30 days"]}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-sm font-medium text-blue-900">
                    31-60 days
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {reportData.ageingBuckets["31-60 days"]}
                  </p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
                  <p className="text-sm font-medium text-orange-900">
                    61-90 days
                  </p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {reportData.ageingBuckets["61-90 days"]}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-sm font-medium text-red-900">90+ days</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {reportData.ageingBuckets["90+ days"]}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {dataType === "vendor_performance" && (
          <VendorPerformanceTable reportData={reportData} />
        )}
        {dataType === "machine_stock" && (
          <MachineStockTable reportData={reportData} />
        )}
        {dataType === "refill_summary" && (
          <RefillSummaryTable reportData={reportData} />
        )}
      </div>
    </div>
  );
}
