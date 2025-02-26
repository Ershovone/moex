// src/types/service.ts

export interface Service {
  id: string;
  name: string;
  description: string;
  system: string;
  url: string;
  instructionUrl?: string;
  feedbackUrl?: string;
  popular?: boolean;
}

export interface ServiceGroup {
  id: string;
  name: string;
  services: Service[];
  subgroups?: ServiceGroup[];
}

export interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}
