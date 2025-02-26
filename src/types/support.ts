// src/types/support.ts

import { Request } from "./request";

export interface User {
  id: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
}

export interface UserSearchResult {
  user: User;
  requests: Request[];
}

export interface SupportSearchFilters {
  userQuery: string;
  system?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
