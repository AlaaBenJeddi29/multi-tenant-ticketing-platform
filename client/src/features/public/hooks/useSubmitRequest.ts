import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

interface SubmitRequestResponse {
  success: boolean;
  ticketNumber: number;
  message: string;
}

interface SubmitRequestPayload {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  description: string;
  organizationSlug: string;
}

export function useSubmitRequest() {
  return useMutation({
    mutationFn: async (data: SubmitRequestPayload): Promise<SubmitRequestResponse> => {
      const response = await axios.post<SubmitRequestResponse>(
        `${API_BASE}/public/submit-request`,
        data
      );
      return response.data;
    },
  });
}
