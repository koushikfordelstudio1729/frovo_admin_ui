export interface AccessRequest {
  id: number;
  requester: string;
  permission: string;
  duration: string;
  status: "Pending" | "Approved" | "Rejected";
  requestedDate: string;
}

export interface AccessRequestFilters {
  search: string;
  status?: "Pending" | "Approved" | "Rejected";
}
