export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  totalUsers?: number;
  totalTickets?: number;
}

export interface OrganizationsResponse {
  data: Organization[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateOrganizationInput {
  name: string;
}
