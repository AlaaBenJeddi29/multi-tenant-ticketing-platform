import { useState } from "react";
import { LogOut, Monitor } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useSessions } from "../hooks/useSessions";
import type { Session } from "../types/settings.types";

export function ActiveSessions() {
  const { sessions, isLoading, revokeSession, isRevoking, revokeAllSessions, isRevokingAll } = useSessions();
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [revokeAllDialogOpen, setRevokeAllDialogOpen] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<Session | null>(null);

  const handleRevokeClick = (session: Session) => {
    setSessionToRevoke(session);
    setRevokeDialogOpen(true);
  };

  const handleRevokeConfirm = () => {
    if (sessionToRevoke) {
      revokeSession(sessionToRevoke.id);
      setRevokeDialogOpen(false);
      setSessionToRevoke(null);
    }
  };

  const handleRevokeAllClick = () => {
    setRevokeAllDialogOpen(true);
  };

  const handleRevokeAllConfirm = () => {
    revokeAllSessions();
    setRevokeAllDialogOpen(false);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading sessions...</div>;
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <Monitor className="size-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No active sessions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Active Sessions</h2>
        <p className="text-sm text-muted-foreground">
          Manage your active sessions across devices
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        {sessions.map((session, index) => (
          <Card key={session.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="size-4 text-muted-foreground" />
                  <span className="font-medium">
                    {index === 0 ? "Current Session" : `Session ${index + 1}`}
                  </span>
                  {index === 0 && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Created: {new Date(session.createdAt).toLocaleString()}</p>
                  <p>Expires: {new Date(session.expiresAt).toLocaleString()}</p>
                </div>
              </div>
              {index !== 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeClick(session)}
                  disabled={isRevoking}
                  className="gap-2"
                >
                  <LogOut className="size-4" />
                  Revoke
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div>
          <h3 className="font-medium">Log out of all other devices</h3>
          <p className="text-sm text-muted-foreground">
            This will revoke all sessions except your current one
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleRevokeAllClick}
          disabled={isRevokingAll || sessions.length <= 1}
        >
          {isRevokingAll ? "Revoking..." : "Revoke All Other Sessions"}
        </Button>
      </div>

      {/* Revoke Single Session Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Session?</DialogTitle>
            <DialogDescription>
              This will revoke the selected session. The device will need to log in again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeConfirm}>
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke All Sessions Dialog */}
      <Dialog open={revokeAllDialogOpen} onOpenChange={setRevokeAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke All Other Sessions?</DialogTitle>
            <DialogDescription>
              This will revoke all sessions except your current one. You will need to log in again on all other devices.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeAllConfirm}>
              Revoke All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
