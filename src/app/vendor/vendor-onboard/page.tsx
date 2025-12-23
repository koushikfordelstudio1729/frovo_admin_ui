"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Label,
  Select,
  Textarea,
  Table,
  Badge,
  Pagination,
  Toggle,
  ConfirmDialog,
  SearchableSelect,
  SuccessDialog,
} from "@/components";
import FileUpload from "@/components/common/FileUpload";
import {
  createVendor,
  getVendors,
  deleteVendor,
  updateVendor,
  getCompanies,
} from "@/services/vendor";
import { Eye, Edit2, Trash2, Upload, CheckCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Vendor, VendorStatus } from "@/types/vendor-data.types";

const vendorTypeOptions = [
  { label: "Snacks", value: "snacks" },
  { label: "Beverages", value: "beverages" },
  { label: "Dairy", value: "dairy" },
  { label: "Bakery", value: "bakery" },
  { label: "Frozen", value: "frozen" },
  { label: "Fresh", value: "fresh" },
];

const vendorCategoryOptions = [
  { label: "Consumables", value: "consumables" },
  { label: "Raw Materials", value: "raw_materials" },
  { label: "Packaging", value: "packaging" },
  { label: "Services", value: "services" },
];

const paymentTermsOptions = [
  { label: "Net 30", value: "net_30" },
  { label: "Net 60", value: "net_60" },
  { label: "Net 90", value: "net_90" },
  { label: "Advance", value: "advance" },
  { label: "Cash on Delivery", value: "cod" },
];

const paymentMethodOptions = [
  { label: "NEFT", value: "neft" },
  { label: "RTGS", value: "rtgs" },
  { label: "UPI", value: "upi" },
  { label: "Cheque", value: "cheque" },
  { label: "Cash", value: "cash" },
];

const billingCycleOptions = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Bi-weekly", value: "biweekly" },
];

const riskRatingOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const VendorOnboardPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check URL params for tab and prefill data
  const urlTab = searchParams.get("tab");
  const urlCin = searchParams.get("cin");
  const urlCompanyName = searchParams.get("companyName");
  const urlAddress = searchParams.get("address");
  const urlEmail = searchParams.get("email");
  const urlGst = searchParams.get("gst");

  const [activeTab, setActiveTab] = useState<"list" | "add">(
    urlTab === "add" ? "add" : "list"
  );

  // Form States
  const [cinNumber, setCinNumber] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorBillingName, setVendorBillingName] = useState("");
  const [vendorType, setVendorType] = useState("");
  const [vendorCategory, setVendorCategory] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [baVendor, setBaVendor] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [gstDetails, setGstDetails] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [tdsRate, setTdsRate] = useState("");
  const [billingCycle, setBillingCycle] = useState("");
  const [riskRating, setRiskRating] = useState("medium");
  const [riskNotes, setRiskNotes] = useState("");
  const [contractTerms, setContractTerms] = useState("");
  const [contractExpiryDate, setContractExpiryDate] = useState("");
  const [contractRenewalDate, setContractRenewalDate] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // List States
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
    page: 1,
  });
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });

  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    id: string;
    name: string;
    currentEnabled: boolean;
  }>({ open: false, id: "", name: "", currentEnabled: false });

  // Company dropdown states
  const [companies, setCompanies] = useState<any[]>([]);
  const [companyOptions, setCompanyOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const ITEMS_PER_PAGE = 10;
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (activeTab === "list") {
      fetchVendors();
    }
  }, [activeTab, currentPage]);

  // Fetch companies for dropdown
  useEffect(() => {
    const fetchCompaniesForDropdown = async () => {
      try {
        const res = await getCompanies({ page: 1, limit: 1000 });
        const companiesData = res.data.data;

        // Filter out companies with empty/null CIN
        const validCompanies = companiesData.filter(
          (company: any) => company.cin && company.cin.trim() !== ""
        );

        setCompanies(validCompanies);

        // Create options for dropdown: "CIN - Company Name"
        // Use a Set to ensure unique CINs
        const uniqueCompanies = validCompanies.reduce(
          (acc: any[], company: any) => {
            if (!acc.find((c) => c.cin === company.cin)) {
              acc.push(company);
            }
            return acc;
          },
          []
        );

        const options = uniqueCompanies.map((company: any) => ({
          label: `${company.cin} - ${company.registered_company_name}`,
          value: company.cin,
        }));
        setCompanyOptions(options);
      } catch (error) {
        console.error("Failed to fetch companies", error);
      }
    };

    if (activeTab === "add") {
      fetchCompaniesForDropdown();
    }
  }, [activeTab]);

  // Prefill form from URL parameters
  useEffect(() => {
    if (urlCin) {
      setCinNumber(urlCin);
    }
    if (urlCompanyName) {
      setVendorBillingName(urlCompanyName);
    }
    if (urlAddress) {
      setBillingAddress(urlAddress);
    }
    if (urlEmail) {
      setVendorEmail(urlEmail);
    }
    if (urlGst) {
      setGstDetails(urlGst);
    }
  }, [urlCin, urlCompanyName, urlAddress, urlEmail, urlGst]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await getVendors({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search,
      });

      setVendors(res.data.data.vendors);
      setPagination({
        totalPages: res.data.data.pages,
        totalCount: res.data.data.total,
        page: res.data.data.page,
      });
    } catch (error) {
      toast.error("Failed to load vendors");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchVendors();
  };

  const handleCompanySelect = (selectedCin: string) => {
    setCinNumber(selectedCin);

    // Find the selected company and prefill related fields
    const selectedCompany = companies.find((c: any) => c.cin === selectedCin);
    if (selectedCompany) {
      setVendorBillingName(selectedCompany.registered_company_name || "");
      setBillingAddress(selectedCompany.company_address || "");
      setVendorEmail(selectedCompany.office_email || "");
      setGstDetails(selectedCompany.gst_number || "");
    }
  };

  const handleToggleStatus = async (id: string, currentEnabled: boolean) => {
    try {
      const newStatus: VendorStatus = currentEnabled ? "inactive" : "active";
      await updateVendor(id, { vendor_status: newStatus });

      setVendors((prev) =>
        prev.map((v) => (v._id === id ? { ...v, vendor_status: newStatus } : v))
      );

      toast.success(
        `Vendor ${currentEnabled ? "deactivated" : "activated"} successfully`
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update vendor status"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVendor(deleteDialog.id);
      toast.success("Brand deleted successfully");
      setDeleteDialog({ open: false, id: "", name: "" });
      fetchVendors();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete brand");
    }
  };

  const handleSubmit = async () => {
    if (!vendorName || !vendorBillingName || !cinNumber) {
      return toast.error("Please fill in all required fields");
    }

    const payload: any = {
      vendor_name: vendorName,
      vendor_billing_name: vendorBillingName,
      vendor_type: vendorType ? [vendorType] : [],
      vendor_category: vendorCategory,
      material_categories_supplied: [],
      primary_contact_name: primaryContact,
      contact_phone: contactPhone,
      vendor_email: vendorEmail,
      vendor_address: billingAddress,
      cin: cinNumber,
      bank_account_number: baVendor,
      ifsc_code: ifscCode,
      payment_terms: paymentTerms,
      payment_methods: paymentMethod,
      gst_number: gstDetails,
      pan_number: panNumber,
      tds_rate: Number(tdsRate) || 1,
      billing_cycle: billingCycle,
      risk_rating: riskRating,
      risk_notes: riskNotes,
      contract_terms: contractTerms,
      contract_expiry_date: contractExpiryDate,
      contract_renewal_date: contractRenewalDate,
      internal_notes: internalNotes,
    };

    try {
      await createVendor(payload);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);

        setActiveTab("list");
        fetchVendors();
      }, 2000);

      // Reset form
      setCinNumber("");
      setVendorName("");
      setVendorBillingName("");
      setVendorType("");
      setVendorCategory("");
      setPrimaryContact("");
      setContactPhone("");
      setVendorEmail("");
      setBillingAddress("");
      setBaVendor("");
      setIfscCode("");
      setPaymentTerms("");
      setPaymentMethod("");
      setGstDetails("");
      setPanNumber("");
      setTdsRate("");
      setBillingCycle("");
      setRiskRating("medium");
      setRiskNotes("");
      setContractTerms("");
      setContractExpiryDate("");
      setContractRenewalDate("");
      setInternalNotes("");

      // Switch to list tab
      setActiveTab("list");
      fetchVendors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create brand");
    }
  };

  const vendorColumns = [
    { key: "vendor_id", label: "Brand ID" },
    { key: "vendor_name", label: "Brand Name" },
    { key: "vendor_category", label: "Category" },
    { key: "contact_phone", label: "Contact" },
    { key: "vendor_email", label: "Email" },
    { key: "verification_status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    const vendor = row as Vendor;

    switch (key) {
      case "vendor_name":
        return (
          <span
            className="text-orange-500 font-medium cursor-pointer hover:underline"
            onClick={() =>
              router.push(`/vendor/vendor-management/view/${vendor._id}`)
            }
          >
            {value}
          </span>
        );

      case "vendor_category":
        if (!value) return <span className="text-sm text-gray-400">-</span>;
        const categoryLabel =
          value === "raw_materials"
            ? "Raw Materials"
            : value.charAt(0).toUpperCase() + value.slice(1);
        return <span className="text-sm">{categoryLabel}</span>;

      case "verification_status":
        if (!value) return <Badge label="PENDING" variant="warning" />;
        const verifyVariant =
          value === "verified" || value === "approved"
            ? "active"
            : value === "pending" || value === "in-review"
            ? "warning"
            : "rejected";
        return (
          <Badge
            showDot
            label={value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
            variant={verifyVariant}
          />
        );

      case "action":
        return (
          <div className="flex items-center gap-3">
            <button
              title="View Details"
              onClick={() =>
                router.push(`/vendor/vendor-management/view/${vendor._id}`)
              }
            >
              <Eye
                size={18}
                className="text-green-600 cursor-pointer hover:text-green-700"
              />
            </button>
            <button
              title="Edit Vendor"
              onClick={() =>
                router.push(`/vendor/vendor-management/edit/${vendor._id}`)
              }
            >
              <Edit2
                size={18}
                className="text-purple-600 cursor-pointer hover:text-purple-700"
              />
            </button>
            <button
              title="Delete Vendor"
              onClick={() =>
                setDeleteDialog({
                  open: true,
                  id: vendor._id,
                  name: vendor.vendor_name,
                })
              }
            >
              <Trash2
                size={18}
                className="text-red-600 cursor-pointer hover:text-red-700"
              />
            </button>
            <Toggle
              enabled={vendor.vendor_status === "active"}
              onChange={() =>
                setStatusDialog({
                  open: true,
                  id: vendor._id,
                  name: vendor.vendor_name,
                  currentEnabled: vendor.vendor_status === "active",
                })
              }
            />
          </div>
        );

      default:
        return value || "-";
    }
  };

  const handleConfirmStatusChange = async () => {
    const { id, currentEnabled } = statusDialog;
    await handleToggleStatus(id, currentEnabled);
    setStatusDialog({ open: false, id: "", name: "", currentEnabled: false });
  };

  return (
    <div className="min-h-screen pt-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Label className="text-2xl font-semibold">Brand Onboard</Label>
          <p className="text-gray-500 text-sm mt-1">
            {activeTab === "list"
              ? `Total ${pagination.totalCount} Brands registered`
              : "Add new brands to the system"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("list")}
            className={`pb-4 px-2 font-medium transition-colors relative cursor-pointer ${
              activeTab === "list"
                ? "text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Brands List
            {activeTab === "list" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`pb-4 px-2 font-medium transition-colors relative cursor-pointer ${
              activeTab === "add"
                ? "text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Add Brand
            {activeTab === "add" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "list" ? (
        <div>
          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <div className="w-sm">
                <Input
                  label="Search Brands"
                  placeholder="Search by name or brand ID"
                  value={search}
                  inputClassName="py-3 px-4"
                  labelClassName="text-xl"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  variant="search"
                />
              </div>
              <Button
                variant="primary"
                className="mt-auto rounded-lg"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="rounded-lg flex items-center gap-2"
                onClick={() =>
                  router.push("/vendor/vendor-management/bulk-verify")
                }
              >
                <CheckCircle size={18} />
                Bulk Verify
              </Button>
              <Button
                variant="secondary"
                className="rounded-lg flex items-center gap-2"
                onClick={() =>
                  router.push("/vendor/vendor-management/bulk-upload")
                }
              >
                <Upload size={18} />
                Bulk Upload
              </Button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">Loading brands...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No brands found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="min-w-[1500px]">
                  <Table
                    columns={vendorColumns}
                    data={vendors}
                    renderCell={renderCell}
                  />
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-gray-600">
                  Showing page {pagination.page} of {pagination.totalPages}
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8">
          {/* brands Details Form */}
          <Label className="text-orange-500 text-2xl font-semibold">
            Brand Details
          </Label>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <SearchableSelect
              label="Select Company (CIN) *"
              variant="orange"
              options={companyOptions}
              value={cinNumber}
              onChange={(val) => {
                if (urlCin) return; // keep locked when coming from company page
                handleCompanySelect(val);
              }}
              placeholder="Select company by CIN"
              selectClassName="py-4 px-4"
            />

            <Input
              label="Brand Name *"
              variant="orange"
              placeholder="Enter brand name"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Input
              label="Brand Billing Name *"
              variant="orange"
              placeholder="Enter Billing Name"
              value={vendorBillingName}
              onChange={(e) => setVendorBillingName(e.target.value)}
              disabled={!!urlCompanyName}
            />
            <Input
              label="Email ID *"
              variant="orange"
              placeholder="Enter email ID"
              value={vendorEmail}
              onChange={(e) => setVendorEmail(e.target.value)}
              disabled={!!urlEmail}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Select
              label="Brand Type"
              variant="orange"
              options={vendorTypeOptions}
              value={vendorType}
              onChange={setVendorType}
              placeholder="Select vendor type"
              selectClassName="py-4 px-4"
            />
            <Select
              label="Brand Category"
              variant="orange"
              options={vendorCategoryOptions}
              value={vendorCategory}
              onChange={setVendorCategory}
              placeholder="Select vendor category"
              selectClassName="py-4 px-4"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Input
              label="Primary Contact Name"
              variant="orange"
              placeholder="Enter primary contact name"
              value={primaryContact}
              onChange={(e) => setPrimaryContact(e.target.value)}
            />
            <Input
              label="Contact Phone"
              variant="orange"
              placeholder="Enter contact phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Textarea
              label="Address (Billing)"
              variant="orange"
              placeholder="Enter billing address"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              rows={3}
              disabled={!!urlAddress}
            />
          </div>

          {/* Finance */}
          <div className="w-full border-2 my-12" />
          <Label className="text-orange-500 text-2xl font-semibold">
            Finance & Compliance
          </Label>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Input
              label="Bank Account Number"
              variant="orange"
              placeholder="Enter Bank Account Number"
              value={baVendor}
              onChange={(e) => setBaVendor(e.target.value)}
            />
            <Input
              label="IFSC Code"
              variant="orange"
              placeholder="Enter IFSC code"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Select
              label="Payment Terms"
              variant="orange"
              options={paymentTermsOptions}
              value={paymentTerms}
              onChange={setPaymentTerms}
              placeholder="Select payment terms"
              selectClassName="py-4 px-4"
            />
            <Select
              label="Payment Method"
              variant="orange"
              options={paymentMethodOptions}
              value={paymentMethod}
              onChange={setPaymentMethod}
              placeholder="Select payment method"
              selectClassName="py-4 px-4"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Input
              label="GST Number"
              variant="orange"
              placeholder="Enter GST number"
              value={gstDetails}
              onChange={(e) => setGstDetails(e.target.value)}
              disabled={!!urlGst}
            />
            <Input
              label="PAN Number"
              variant="orange"
              placeholder="Enter PAN number"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value)}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Input
              label="TDS Rate (%)"
              variant="orange"
              type="number"
              placeholder="Enter TDS Rate"
              value={tdsRate}
              onChange={(e) => setTdsRate(e.target.value)}
            />
            <Select
              label="Billing Cycle"
              variant="orange"
              options={billingCycleOptions}
              value={billingCycle}
              onChange={setBillingCycle}
              placeholder="Select Billing Cycle"
              selectClassName="py-4 px-4"
            />
          </div>

          {/* Risk & Contract */}
          <div className="w-full border-2 my-12" />
          <Label className="text-orange-500 text-2xl font-semibold">
            Risk Assessment & Contract
          </Label>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Select
              label="Risk Rating"
              variant="orange"
              options={riskRatingOptions}
              value={riskRating}
              onChange={setRiskRating}
              placeholder="Select risk rating"
              selectClassName="py-4 px-4"
            />
            <Textarea
              label="Risk Notes"
              variant="orange"
              placeholder="Enter risk notes"
              value={riskNotes}
              onChange={(e) => setRiskNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Input
              label="Contract Expiry Date"
              variant="orange"
              type="date"
              value={contractExpiryDate}
              onChange={(e) => setContractExpiryDate(e.target.value)}
              min={today}
            />
            <Input
              label="Contract Renewal Date"
              variant="orange"
              type="date"
              value={contractRenewalDate}
              onChange={(e) => setContractRenewalDate(e.target.value)}
              min={today}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-12">
            <Textarea
              label="Contract Terms"
              variant="orange"
              placeholder="Enter contract terms"
              value={contractTerms}
              onChange={(e) => setContractTerms(e.target.value)}
              rows={4}
            />
            <Textarea
              label="Internal Notes"
              variant="orange"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Enter internal notes"
              rows={4}
            />
          </div>

          {/* Footer Buttons */}
          <div className="mt-12 flex justify-center gap-6">
            <Button
              className="px-10 rounded-lg"
              variant="secondary"
              type="button"
              onClick={() => setActiveTab("list")}
            >
              Cancel
            </Button>
            <Button
              className="px-10 rounded-lg"
              variant="primary"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Vendor"
        message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: "", name: "" })}
      />

      {/* Status Change Confirmation Dialog */}
      <ConfirmDialog
        isOpen={statusDialog.open}
        title={
          statusDialog.currentEnabled ? "Deactivate Brand" : "Activate Brand"
        }
        message={
          statusDialog.currentEnabled
            ? `Are you sure you want to deactivate "${statusDialog.name}"?`
            : `Are you sure you want to activate "${statusDialog.name}"?`
        }
        confirmText={statusDialog.currentEnabled ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        confirmVariant={statusDialog.currentEnabled ? "danger" : "primary"}
        onConfirm={handleConfirmStatusChange}
        onCancel={() =>
          setStatusDialog({
            open: false,
            id: "",
            name: "",
            currentEnabled: false,
          })
        }
      />

      <SuccessDialog
        open={showSuccess}
        title="Brand created"
        message="Brand has been added successfully."
        primaryText="OK"
        onClose={() => {
          setShowSuccess(false);
          setActiveTab("list");
          fetchVendors();
        }}
      />
    </div>
  );
};

export default VendorOnboardPage;
