import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getSessions,
  revokeSession,
  revokeAllSessions,
} from "../api/settings.api";
import { useToast } from "@/hooks/use-toast";

export function useSessions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions,
  });

  const revokeMutation = useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast({
        title: "Session revoked",
        description: "The session has been revoked successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to revoke session",
        variant: "destructive",
      });
    },
  });

  const revokeAllMutation = useMutation({
    mutationFn: () => revokeAllSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast({
        title: "All sessions revoked",
        description: "All other sessions have been revoked successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to revoke sessions",
        variant: "destructive",
      });
    },
  });

  return {
    sessions: query.data,
    isLoading: query.isLoading,
    revokeSession: revokeMutation.mutate,
    isRevoking: revokeMutation.isPending,
    revokeAllSessions: revokeAllMutation.mutate,
    isRevokingAll: revokeAllMutation.isPending,
  };
}
