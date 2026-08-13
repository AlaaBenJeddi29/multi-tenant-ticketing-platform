import { useState } from "react";
import { Pencil, Trash2, Power, PowerOff } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useActivateAutomationRule } from "../hooks/useActivateAutomationRule";
import { useDeactivateAutomationRule } from "../hooks/useDeactivateAutomationRule";
import { useDeleteAutomationRule } from "../hooks/useDeleteAutomationRule";
import { TRIGGER_LABELS, CONDITION_LABELS, ACTION_LABELS } from "../utils/labels";

import type { AutomationRule } from "../types/automation.types";
import type { PaginationMeta } from "@/types/pagination.types";

interface AutomationTableProps {
  rules: AutomationRule[];
  meta: PaginationMeta;
  isLoading: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onEditRule: (rule: AutomationRule) => void;
}

export function AutomationTable({
  rules,
  meta,
  isLoading,
  search,
  onSearchChange,
  onPageChange,
  onEditRule,
}: AutomationTableProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const activateMutation = useActivateAutomationRule();
  const deactivateMutation = useDeactivateAutomationRule();
  const deleteMutation = useDeleteAutomationRule();

  // Debounce search input
  useDebounce(
    () => {
      onSearchChange(localSearch);
    },
    300,
    [localSearch]
  );

  const handleToggleEnabled = async (rule: AutomationRule) => {
    if (rule.enabled) {
      await deactivateMutation.mutateAsync(rule.id);
    } else {
      await activateMutation.mutateAsync(rule.id);
    }
  };

  const handleDelete = async (rule: AutomationRule) => {
    if (!window.confirm(`Are you sure you want to delete "${rule.name}"?`)) {
      return;
    }
    await deleteMutation.mutateAsync(rule.id);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search automation rules..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No automation rules found.
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{TRIGGER_LABELS[rule.trigger]}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {CONDITION_LABELS[rule.condition]}
                      {rule.conditionValue && (
                        <div className="text-xs text-muted-foreground">
                          {rule.conditionValue}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {ACTION_LABELS[rule.action]}
                      {rule.actionValue && (
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {rule.actionValue}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.enabled ? "secondary" : "outline"}>
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleToggleEnabled(rule)}
                        disabled={
                          activateMutation.isPending || deactivateMutation.isPending
                        }
                        title={rule.enabled ? "Disable" : "Enable"}
                      >
                        {rule.enabled ? (
                          <PowerOff className="size-4" />
                        ) : (
                          <Power className="size-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEditRule(rule)}
                        title="Edit"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(rule)}
                        disabled={deleteMutation.isPending}
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
