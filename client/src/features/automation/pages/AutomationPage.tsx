import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAutomationRules } from "../hooks/useAutomationRules";
import { AutomationTable } from "../components/AutomationTable";
import { AutomationFormDialog } from "../components/AutomationFormDialog";

import type { AutomationRule } from "../types/automation.types";

/**
 * Automation page - ORG_ADMIN only
 * Access control is enforced at the route level via RequireRole
 */
export default function AutomationPage() {

  // State for query parameters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // State for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  // Fetch automation rules with current filters
  const { data, isLoading } = useAutomationRules({
    page,
    pageSize: 20,
    sortBy: "name",
    sortOrder: "asc",
    search: search || undefined,
  });

  const handleNewRule = () => {
    setSelectedRule(null);
    setDialogOpen(true);
  };

  const handleEditRule = (rule: AutomationRule) => {
    setSelectedRule(rule);
    setDialogOpen(true);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automation Rules</h1>
          <p className="mt-2 text-muted-foreground">
            Automate ticket workflows with custom rules and actions
          </p>
        </div>
        <Button onClick={handleNewRule}>
          <Plus className="mr-2 size-4" />
          New Rule
        </Button>
      </div>

      {/* Table */}
      <AutomationTable
        rules={data?.data || []}
        meta={
          data?.meta || {
            page: 1,
            pageSize: 20,
            total: 0,
            totalPages: 0,
          }
        }
        isLoading={isLoading}
        search={search}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        onEditRule={handleEditRule}
      />

      {/* Form Dialog */}
      <AutomationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rule={selectedRule}
      />
    </div>
  );
}
