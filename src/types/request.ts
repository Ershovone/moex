// src/types/request.ts

export interface Request {
  id: string;
  systemId: string;
  systemName: string;
  authorId: string;
  authorName: string;
  executorId?: string;
  executorName?: string;
  typeId: string;
  typeName: string;
  number: string;
  content: string;
  status: RequestStatus;
  createdAt: string;
  plannedDate?: string;
  executionDate?: string;
  closedDate?: string;
  url: string;
}

export type RequestStatus =
  | "new"
  | "in_progress"
  | "on_approval"
  | "completed"
  | "closed"
  | "cancelled";

export interface RequestGroup {
  id: string;
  name: string;
  subgroups?: RequestGroup[];
}

export interface RequestCardProps {
  request: Request;
  onSelect: (request: Request) => void;
}

export interface RequestTableProps {
  requests: Request[];
  onSelect: (request: Request) => void;
}

export interface RequestFilters {
  search: string;
  system?: string;
  status?: RequestStatus;
  dateFrom?: string;
  dateTo?: string;
  responsible?: string;
}
