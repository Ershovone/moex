// src/types/admin.ts

export interface ConfigItem {
  id: string;
  name: string;
  description?: string;
  published: boolean;
  parentId?: string;
  order: number;
  url?: string;
  adminGroups?: string[];
  userGroups?: string[];
  type: "service" | "system" | "request" | "task";
  metadata?: Record<string, any>;
}

export interface GlobalParameter {
  id: string;
  name: string;
  description?: string;
  value: string | number | boolean | string[];
  type: "string" | "number" | "boolean" | "array";
}

export interface UserGroup {
  id: string;
  name: string;
  source: "ad" | "manual";
  members?: string[];
}

export interface AdminTab {
  id: string;
  name: string;
  icon: string;
}
