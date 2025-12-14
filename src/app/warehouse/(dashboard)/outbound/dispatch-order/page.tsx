"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Input, Select, Button, Label, Textarea } from "@/components";
import { warehouseAPI } from "@/services/warehouseAPI";
import type { FieldAgent, CreateDispatchOrderPayload, PurchaseOrder, GRN } from "@/types";
import { toast } from "react-hot-toast";

interface ProductItem {
  sku: string;
  quantity: string;
}

interface SKUOption {
  label: string;
  value: string;
  availableQuantity?: number;
}

export default function DispatchOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fieldAgents, setFieldAgents] = useState<FieldAgent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [skuOptions, setSKUOptions] = useState<SKUOption[]>([]);
  const [loadingSKUs, setLoadingSKUs] = useState(true);

  const [formData, setFormData] = useState({
    dispatchId: "",
    destination: "",
    assignedAgent: "",
    notes: "",
  });

  const [products, setProducts] = useState<ProductItem[]>([
    { sku: "", quantity: "" },
  ]);

  // Fetch field agents and SKUs on component mount
  useEffect(() => {
    const fetchFieldAgents = async () => {
      try {
        const response = await warehouseAPI.getFieldAgents();
        const apiResponse = response.data;
        if (apiResponse.success) {
          setFieldAgents(apiResponse.data);
        }
      } catch (error) {
        console.error("Error fetching field agents:", error);
        toast.error("Failed to load field agents");
      } finally {
        setLoadingAgents(false);
      }
    };

    const fetchSKUs = async () => {
      try {
        // Fetch both POs and GRNs to calculate available inventory
        const [poResponse, grnResponse] = await Promise.all([
          warehouseAPI.getPurchaseOrders(),
          warehouseAPI.getGRNs(),
        ]);

        const poData = poResponse.data;
        const grnData = grnResponse.data;

        if (poData.success && grnData.success) {
          // First, get product names from POs
          const productInfo = new Map<string, string>();
          poData.data.forEach((po: PurchaseOrder) => {
            po.po_line_items.forEach((item) => {
              if (!productInfo.has(item.sku)) {
                productInfo.set(item.sku, item.productName);
              }
            });
          });

          // Calculate available stock from GRNs (received goods)
          const stockMap = new Map<string, number>();
          grnData.data.forEach((grn: GRN) => {
            grn.grn_line_items.forEach((item) => {
              const currentStock = stockMap.get(item.sku) || 0;
              stockMap.set(item.sku, currentStock + item.quantity);
            });
          });

          // Create options with available stock
          const options: SKUOption[] = Array.from(productInfo.entries()).map(([sku, productName]) => {
            const availableQty = stockMap.get(sku) || 0;
            return {
              label: `${sku} - ${productName} (Available: ${availableQty})`,
              value: sku,
              availableQuantity: availableQty,
            };
          });

          // Sort by SKU
          options.sort((a, b) => a.value.localeCompare(b.value));

          setSKUOptions(options);
        }
      } catch (error) {
        console.error("Error fetching SKUs:", error);
        toast.error("Failed to load product SKUs");
      } finally {
        setLoadingSKUs(false);
      }
    };

    fetchFieldAgents();
    fetchSKUs();
  }, []);

  // Convert field agents to select options
  const agentOptions = fieldAgents.map((agent) => ({
    label: agent.name,
    value: agent._id,
  }));

  const handleAddProduct = () => {
    setProducts([...products, { sku: "", quantity: "" }]);
  };

  const handleRemoveProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const handleProductChange = (
    index: number,
    field: keyof ProductItem,
    value: string
  ) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.dispatchId.trim()) {
      toast.error("Please enter dispatch ID");
      return;
    }

    if (!formData.destination.trim()) {
      toast.error("Please enter destination");
      return;
    }

    if (!formData.assignedAgent) {
      toast.error("Please select an assigned agent");
      return;
    }

    const validProducts = products.filter(p => p.sku.trim() && p.quantity.trim());
    if (validProducts.length === 0) {
      toast.error("Please add at least one product with SKU and quantity");
      return;
    }

    // Validate stock availability
    for (const product of validProducts) {
      const skuOption = skuOptions.find(opt => opt.value === product.sku);
      const requestedQty = parseInt(product.quantity, 10);
      const availableQty = skuOption?.availableQuantity || 0;

      if (requestedQty > availableQty) {
        toast.error(
          `Insufficient stock for ${product.sku}. Available: ${availableQty}, Requested: ${requestedQty}`
        );
        return;
      }
    }

    try {
      setLoading(true);

      const payload: CreateDispatchOrderPayload = {
        dispatchId: formData.dispatchId,
        destination: formData.destination,
        products: validProducts.map(p => ({
          sku: p.sku,
          quantity: parseInt(p.quantity, 10),
        })),
        assignedAgent: formData.assignedAgent,
        notes: formData.notes,
        status: "pending",
      };

      const response = await warehouseAPI.createDispatchOrder(payload);
      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success("Dispatch order created successfully");
        // Reset form
        setFormData({
          dispatchId: "",
          destination: "",
          assignedAgent: "",
          notes: "",
        });
        setProducts([{ sku: "", quantity: "" }]);

        // Optionally navigate back or to dispatch list
        // router.push('/warehouse/outbound/dispatches');
      }
    } catch (error) {
      console.error("Error creating dispatch order:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create dispatch order";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    const validProducts = products.filter(p => p.sku.trim() && p.quantity.trim());

    const previewData = {
      dispatchId: formData.dispatchId,
      destination: formData.destination,
      products: validProducts.map(p => ({
        sku: p.sku,
        quantity: parseInt(p.quantity, 10),
      })),
      assignedAgent: fieldAgents.find(a => a._id === formData.assignedAgent)?.name || formData.assignedAgent,
      notes: formData.notes,
      status: "pending",
    };

    console.log("Preview Data:", previewData);
    toast.success("Preview data logged to console");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 my-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Dispatch Order Form
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-full bg-white rounded-2xl p-8">
        {/* Dispatch ID */}
        <div className="mb-6">
          <Label className="text-lg font-medium text-gray-700 mb-2 block">
            Dispatch ID *
          </Label>
          <Input
            id="dispatchId"
            variant="orange"
            value={formData.dispatchId}
            onChange={(e) =>
              setFormData({ ...formData, dispatchId: e.target.value })
            }
            placeholder="e.g., DO-0001"
          />
        </div>

        {/* Destination */}
        <div className="mb-6">
          <Label className="text-lg font-medium text-gray-700 mb-2 block">
            Destination Address *
          </Label>
          <Textarea
            id="destination"
            variant="orange"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
            placeholder="Enter complete destination address"
            rows={3}
            textareaClassName="w-full"
          />
        </div>

        {/* Products Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Label className="text-lg font-medium text-gray-700">
              Products *
            </Label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddProduct}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>

          <div className="space-y-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Product SKU
                  </Label>
                  {loadingSKUs ? (
                    <div className="text-sm text-gray-500">Loading SKUs...</div>
                  ) : (
                    <Select
                      id={`sku-${index}`}
                      options={skuOptions}
                      value={product.sku}
                      placeholder="Select Product SKU"
                      selectClassName="py-4 px-4 border-2 border-orange-300"
                      onChange={(val) => handleProductChange(index, "sku", val)}
                    />
                  )}
                </div>

                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Quantity
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      variant="orange"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(index, "quantity", e.target.value)
                      }
                      placeholder="Enter quantity"
                      min="1"
                    />
                    {product.sku && (
                      <p className="text-xs text-gray-500 mt-1">
                        Available: {skuOptions.find(opt => opt.value === product.sku)?.availableQuantity || 0}
                      </p>
                    )}
                  </div>
                  {products.length > 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveProduct(index)}
                      className="mb-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Agent */}
        <div className="mb-6">
          <Label className="text-lg font-medium text-gray-700 mb-2 block">
            Assigned Agent *
          </Label>
          {loadingAgents ? (
            <div className="text-gray-500">Loading agents...</div>
          ) : (
            <Select
              id="assignedAgent"
              options={agentOptions}
              value={formData.assignedAgent}
              placeholder="Select agent name"
              className="w-lg"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) => setFormData({ ...formData, assignedAgent: val })}
            />
          )}
        </div>

        {/* Dispatch Notes */}
        <div className="mb-8">
          <Label
            htmlFor="notes"
            className="text-lg font-medium text-gray-700 mb-2 block"
          >
            Dispatch Notes
          </Label>
          <Textarea
            id="notes"
            label={undefined}
            variant="orange"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Enter any additional notes..."
            rows={5}
            textareaClassName="w-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            className="rounded-lg"
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Dispatch"}
          </Button>
          <Button
            className="rounded-lg"
            type="button"
            variant="secondary"
            size="lg"
            onClick={handlePreview}
          >
            Preview
          </Button>
        </div>
      </form>
    </div>
  );
}
