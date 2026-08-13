import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { usePriorities } from "@/features/priorities/hooks/usePriorities";
import { useUsersList } from "@/features/users/hooks/useUsersList";
import { useCreateAutomationRule } from "../hooks/useCreateAutomationRule";
import { useUpdateAutomationRule } from "../hooks/useUpdateAutomationRule";
import { automationRuleSchema, type AutomationRuleFormData } from "../schemas/automation.schema";
import {
  TRIGGER_LABELS,
  CONDITION_LABELS,
  ACTION_LABELS,
  conditionRequiresValue,
  actionRequiresValue,
} from "../utils/labels";

import type { AutomationRule } from "../types/automation.types";
import type { TicketStatus } from "@/features/tickets/types/ticket.types";

const TICKET_STATUSES: TicketStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "WAITING_REQUESTER",
  "RESOLVED",
  "CLOSED",
];

const STATUS_LABELS: Record<TicketStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  WAITING_REQUESTER: "Waiting Requester",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

interface AutomationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: AutomationRule | null;
}

export function AutomationFormDialog({
  open,
  onOpenChange,
  rule,
}: AutomationFormDialogProps) {
  const isEditing = !!rule;
  const createMutation = useCreateAutomationRule();
  const updateMutation = useUpdateAutomationRule();

  // Fetch priorities for PRIORITY_IS condition and CHANGE_PRIORITY action
  const { data: prioritiesData } = usePriorities({ isActive: true, pageSize: 100 });

  // Fetch users for ASSIGN_AGENT action
  const { data: usersData } = useUsersList({
    page: 1,
    pageSize: 100,
    sortBy: "lastName",
    sortOrder: "asc",
    isActive: true,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AutomationRuleFormData>({
    resolver: zodResolver(automationRuleSchema),
    defaultValues: rule
      ? {
          name: rule.name,
          trigger: rule.trigger,
          condition: rule.condition,
          conditionValue: rule.conditionValue,
          action: rule.action,
          actionValue: rule.actionValue,
        }
      : {
          name: "",
          trigger: "TICKET_CREATED",
          condition: "ALWAYS",
          conditionValue: null,
          action: "ADD_COMMENT",
          actionValue: null,
        },
  });

  // Watch condition and action to render dynamic controls
  const selectedCondition = watch("condition");
  const selectedAction = watch("action");

  // Reset conditionValue when condition changes
  useEffect(() => {
    if (!conditionRequiresValue(selectedCondition)) {
      setValue("conditionValue", null);
    }
  }, [selectedCondition, setValue]);

  // Reset actionValue when action changes
  useEffect(() => {
    if (!actionRequiresValue(selectedAction)) {
      setValue("actionValue", null);
    }
  }, [selectedAction, setValue]);

  // Reset form when dialog opens/closes or rule changes
  useEffect(() => {
    if (open) {
      reset(
        rule
          ? {
              name: rule.name,
              trigger: rule.trigger,
              condition: rule.condition,
              conditionValue: rule.conditionValue,
              action: rule.action,
              actionValue: rule.actionValue,
            }
          : {
              name: "",
              trigger: "TICKET_CREATED",
              condition: "ALWAYS",
              conditionValue: null,
              action: "ADD_COMMENT",
              actionValue: null,
            }
      );
    }
  }, [open, rule, reset]);

  const onSubmit = async (data: AutomationRuleFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: rule.id, input: data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error handled via mutation state
    }
  };

  /**
   * Render dynamic condition value input based on selected condition
   */
  const renderConditionValueInput = () => {
    if (!conditionRequiresValue(selectedCondition)) {
      return null;
    }

    if (selectedCondition === "STATUS_IS") {
      return (
        <Field>
          <FieldLabel htmlFor="conditionValue">Status *</FieldLabel>
          <Controller
            name="conditionValue"
            control={control}
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger id="conditionValue">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.conditionValue && (
            <FieldError>{errors.conditionValue.message}</FieldError>
          )}
        </Field>
      );
    }

    if (selectedCondition === "PRIORITY_IS") {
      return (
        <Field>
          <FieldLabel htmlFor="conditionValue">Priority *</FieldLabel>
          <Controller
            name="conditionValue"
            control={control}
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger id="conditionValue">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {prioritiesData?.data.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="size-2 rounded-full"
                          style={{ backgroundColor: priority.color }}
                        />
                        {priority.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.conditionValue && (
            <FieldError>{errors.conditionValue.message}</FieldError>
          )}
        </Field>
      );
    }

    return null;
  };

  /**
   * Render dynamic action value input based on selected action
   */
  const renderActionValueInput = () => {
    if (!actionRequiresValue(selectedAction)) {
      return null;
    }

    if (selectedAction === "ASSIGN_AGENT") {
      return (
        <Field>
          <FieldLabel htmlFor="actionValue">Agent *</FieldLabel>
          <Controller
            name="actionValue"
            control={control}
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger id="actionValue">
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  {usersData?.data.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.actionValue && <FieldError>{errors.actionValue.message}</FieldError>}
        </Field>
      );
    }

    if (selectedAction === "CHANGE_STATUS") {
      return (
        <Field>
          <FieldLabel htmlFor="actionValue">Status *</FieldLabel>
          <Controller
            name="actionValue"
            control={control}
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger id="actionValue">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.actionValue && <FieldError>{errors.actionValue.message}</FieldError>}
        </Field>
      );
    }

    if (selectedAction === "CHANGE_PRIORITY") {
      return (
        <Field>
          <FieldLabel htmlFor="actionValue">Priority *</FieldLabel>
          <Controller
            name="actionValue"
            control={control}
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger id="actionValue">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {prioritiesData?.data.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="size-2 rounded-full"
                          style={{ backgroundColor: priority.color }}
                        />
                        {priority.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.actionValue && <FieldError>{errors.actionValue.message}</FieldError>}
        </Field>
      );
    }

    if (
      selectedAction === "ADD_COMMENT" ||
      selectedAction === "SEND_NOTIFICATION" ||
      selectedAction === "SEND_EMAIL"
    ) {
      return (
        <Field>
          <FieldLabel htmlFor="actionValue">Content *</FieldLabel>
          <textarea
            id="actionValue"
            rows={3}
            placeholder="Enter content..."
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("actionValue")}
          />
          {errors.actionValue && <FieldError>{errors.actionValue.message}</FieldError>}
        </Field>
      );
    }

    if (selectedAction === "WEBHOOK") {
      return (
        <Field>
          <FieldLabel htmlFor="actionValue">Webhook URL *</FieldLabel>
          <Input
            id="actionValue"
            type="url"
            placeholder="https://example.com/webhook"
            {...register("actionValue")}
          />
          {errors.actionValue && <FieldError>{errors.actionValue.message}</FieldError>}
        </Field>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Automation Rule" : "Create Automation Rule"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the automation rule configuration"
              : "Configure a new automation rule for your tickets"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <Field>
            <FieldLabel htmlFor="name">Rule Name *</FieldLabel>
            <Input id="name" placeholder="e.g., Auto-assign new tickets" {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          {/* Trigger */}
          <Field>
            <FieldLabel htmlFor="trigger">When *</FieldLabel>
            <Controller
              name="trigger"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TRIGGER_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.trigger && <FieldError>{errors.trigger.message}</FieldError>}
          </Field>

          {/* Condition */}
          <Field>
            <FieldLabel htmlFor="condition">If *</FieldLabel>
            <Controller
              name="condition"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.condition && <FieldError>{errors.condition.message}</FieldError>}
          </Field>

          {/* Dynamic Condition Value */}
          {renderConditionValueInput()}

          {/* Action */}
          <Field>
            <FieldLabel htmlFor="action">Then *</FieldLabel>
            <Controller
              name="action"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="action">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTION_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.action && <FieldError>{errors.action.message}</FieldError>}
          </Field>

          {/* Dynamic Action Value */}
          {renderActionValueInput()}

          {/* Error Display */}
          {(createMutation.isError || updateMutation.isError) && (
            <Alert variant="destructive">
              {isEditing
                ? "Failed to update automation rule. Please try again."
                : "Failed to create automation rule. Please try again."}
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
