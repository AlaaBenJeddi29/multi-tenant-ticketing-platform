import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getProfile,
  updateProfile,
} from "../api/settings.api";
import type { UpdateProfileRequest } from "../types/settings.types";
import { useToast } from "@/hooks/use-toast";

export function useProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}
