export interface AuditLog {
  id: number;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  beforeAfterDiff: string;
}

export interface AuditLogFilters {
  search: string;
}
