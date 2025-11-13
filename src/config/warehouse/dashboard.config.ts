export const categoryOptions = [
  { label: "Snacks", value: "snacks" },
  { label: "Drinks", value: "drinks" },
  { label: "Water", value: "water" },
];

export const partnerOptions = [
  { label: "XYZ", value: "xyz" },
  { label: "ABC", value: "ABC" },
  { label: "DYC", value: "DYC" },
];

export const warehouseOptions = [
  { label: "XYZ WAREHOUSE", value: "xyz_warehouse" },
  { label: "ABC WAREHOUSE", value: "abc_warehouse" },
  { label: "DYC WAREHOUSE", value: "dyc_warehouse" },
];

export const dispatchedOrderData = [
  {
    dispatchId: "ID - #12133",
    vendor: "Vendor_name",
    productSku: "SNACKS-103",
    quantity: 910,
    agent: "Sankalp Jha",
  },
  {
    dispatchId: "ID - #12134",
    vendor: "Global Foods Ltd",
    productSku: "DRINKS-205",
    quantity: 750,
    agent: "Priya Sharma",
  },
  {
    dispatchId: "ID - #12135",
    vendor: "Fresh Supplies Co",
    productSku: "SNACKS-118",
    quantity: 1200,
    agent: "Rahul Verma",
  },
  {
    dispatchId: "ID - #12136",
    vendor: "Metro Distributors",
    productSku: "WATER-302",
    quantity: 500,
    agent: "Anjali Reddy",
  },
  {
    dispatchId: "ID - #12137",
    vendor: "Prime Beverages",
    productSku: "DRINKS-410",
    quantity: 890,
    agent: "Karan Singh",
  },
  {
    dispatchId: "ID - #12138",
    vendor: "Snack World Inc",
    productSku: "SNACKS-225",
    quantity: 650,
    agent: "Neha Gupta",
  },
];

export const lowStockData = [
  {
    itemId: "ID - #12133",
    itemName: "Vendor_name",
    category: "SNACKS-103",
    currentStock: 910,
    lastRestocked: "2025-10-25",
    warehouseZone: "Zone A1",
  },
  {
    itemId: "ID - #12134",
    itemName: "Cola Classic",
    category: "DRINKS-205",
    currentStock: 145,
    lastRestocked: "2025-10-28",
    warehouseZone: "Zone B2",
  },
  {
    itemId: "ID - #12135",
    itemName: "Potato Chips",
    category: "SNACKS-118",
    currentStock: 230,
    lastRestocked: "2025-10-30",
    warehouseZone: "Zone A3",
  },
  {
    itemId: "ID - #12136",
    itemName: "Mineral Water 500ml",
    category: "WATER-302",
    currentStock: 80,
    lastRestocked: "2025-11-01",
    warehouseZone: "Zone C1",
  },
  {
    itemId: "ID - #12137",
    itemName: "Energy Drink",
    category: "DRINKS-410",
    currentStock: 310,
    lastRestocked: "2025-11-05",
    warehouseZone: "Zone B1",
  },
  {
    itemId: "ID - #12138",
    itemName: "Chocolate Bars",
    category: "SNACKS-225",
    currentStock: 175,
    lastRestocked: "2025-11-08",
    warehouseZone: "Zone A2",
  },
];
