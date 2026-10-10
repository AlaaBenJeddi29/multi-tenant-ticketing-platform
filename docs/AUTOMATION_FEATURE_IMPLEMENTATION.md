# Automation Feature Implementation

## Overview
Implemented the automation rules feature that allows ORG_ADMIN users to create, manage, and configure automated workflows for tickets. This module is **strictly ORG_ADMIN only** - AGENT users cannot access it at all.

---

## Feature Structure

### Files Created (19 files)

```
client/src/features/automation/
├── api/
│   ├── automation.api.ts           # API functions for automation rules
│   └── automation.queryKeys.ts     # React Query cache keys
├── hooks/
│   ├── useAutomationRules.ts       # List automation rules
│   ├── useAutomationRule.ts        # Get single rule
│   ├── useCreateAutomationRule.ts  # Create rule mutation
│   ├── useUpdateAutomationRule.ts  # Update rule mutation
│   ├── useActivateAutomationRule.ts    # Activate mutation
│   ├── useDeactivateAutomationRule.ts  # Deactivate mutation
│   └── useDeleteAutomationRule.ts  # Delete mutation
├── components/
│   ├── AutomationTable.tsx         # Table with search & pagination
│   └── AutomationFormDialog.tsx    # Complex form with dynamic controls
├── pages/
│   └── AutomationPage.tsx          # Main page with ORG_ADMIN gate
├── types/
│   └── automation.types.ts         # TypeScript interfaces
├── schemas/
│   └── automation.schema.ts        # Zod validation with superRefine
├── utils/
│   └── labels.ts                   # Human-readable labels for enums
└── index.ts                        # Barrel export

client/src/hooks/
└── useDebounce.ts                  # Debounce hook (new)
```

### Integration
- **Updated**: `client/src/app/router/routes.ts` - Added AUTOMATION route
- **Updated**: `client/src/app/router/AppRouter.tsx` - Added AutomationPage route
- **Updated**: `client/src/components/common/AppSidebar.tsx` - Added Automation link (ORG_ADMIN only)

---

## API Contract

### Endpoints
**All endpoints require ORG_ADMIN role** (including GET)

#### GET `/api/automation`
**Query Params**: `page`, `pageSize`, `sortBy`, `sortOrder`, `search`, `enabled`  
**Response**: `{ data: AutomationRule[], meta: { page, pageSize, total, totalPages } }`

#### POST `/api/automation`
**Body**: `CreateAutomationRuleInput`  
**Response**: `AutomationRule`

#### PATCH `/api/automation/:id`
**Body**: `UpdateAutomationRuleInput`  
**Response**: `AutomationRule`

#### PATCH `/api/automation/:id/activate`
**Response**: `AutomationRule`

#### PATCH `/api/automation/:id/deactivate`
**Response**: `AutomationRule`

#### DELETE `/api/automation/:id`
**Response**: `void`

---

## Data Model

### AutomationRule
```typescript
interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  condition: AutomationCondition;
  conditionValue: string | null;  // Opaque string, meaning depends on condition
  action: AutomationAction;
  actionValue: string | null;      // Opaque string, meaning depends on action
  createdAt: string;
  updatedAt: string;
}
```

### Enums

#### AutomationTrigger
```typescript
type AutomationTrigger =
  | "TICKET_CREATED"
  | "TICKET_UPDATED"
  | "COMMENT_CREATED"
  | "STATUS_CHANGED"
  | "SLA_BREACHED";
```

#### AutomationCondition
```typescript
type AutomationCondition =
  | "ALWAYS"
  | "STATUS_IS"
  | "PRIORITY_IS"
  | "UNASSIGNED"
  | "RESPONSE_BREACHED"
  | "RESOLUTION_BREACHED";
```

#### AutomationAction
```typescript
type AutomationAction =
  | "ASSIGN_AGENT"
  | "CHANGE_STATUS"
  | "CHANGE_PRIORITY"
  | "ADD_COMMENT"
  | "CLOSE_TICKET"
  | "REOPEN_TICKET"
  | "SEND_NOTIFICATION"
  | "SEND_EMAIL"
  | "WEBHOOK";
```

---

## Dynamic Form Controls

The tricky UX challenge: `conditionValue` and `actionValue` are opaque strings whose meaning depends on the selected condition/action enum. The form renders different input controls dynamically.

### Condition Value Mapping

| Condition | conditionValue | Control Type |
|-----------|----------------|--------------|
| `ALWAYS` | `null` | None (hidden) |
| `UNASSIGNED` | `null` | None (hidden) |
| `RESPONSE_BREACHED` | `null` | None (hidden) |
| `RESOLUTION_BREACHED` | `null` | None (hidden) |
| `STATUS_IS` | TicketStatus string | Select (5 statuses) |
| `PRIORITY_IS` | priorityId string | Select (from priorities hook) |

### Action Value Mapping

| Action | actionValue | Control Type |
|--------|-------------|--------------|
| `CLOSE_TICKET` | `null` | None (hidden) |
| `REOPEN_TICKET` | `null` | None (hidden) |
| `ASSIGN_AGENT` | userId string | Select (from users hook) |
| `CHANGE_STATUS` | TicketStatus string | Select (5 statuses) |
| `CHANGE_PRIORITY` | priorityId string | Select (from priorities hook) |
| `ADD_COMMENT` | content string | Textarea (free text) |
| `SEND_NOTIFICATION` | content string | Textarea (free text) |
| `SEND_EMAIL` | content string | Textarea (free text) |
| `WEBHOOK` | URL string | Input[type=url] (validated) |

### Implementation Details

**Dynamic Control Rendering:**
```typescript
// Watch selected condition/action
const selectedCondition = watch("condition");
const selectedAction = watch("action");

// Auto-clear values when switching to conditions/actions that don't need them
useEffect(() => {
  if (!conditionRequiresValue(selectedCondition)) {
    setValue("conditionValue", null);
  }
}, [selectedCondition]);

// Render different controls based on selection
if (selectedCondition === "STATUS_IS") {
  return <Select>{/* 5 ticket statuses */}</Select>;
} else if (selectedCondition === "PRIORITY_IS") {
  return <Select>{/* priorities from API */}</Select>;
}
```

**Validation:**
Uses Zod `superRefine` to validate dynamically:
- Conditions/actions that require values validate presence
- WEBHOOK action validates URL format
- All validated at form submission

---

## Role-Based Access Control

### ORG_ADMIN Only Module
This is the **first module** that is completely restricted to ORG_ADMIN.

#### Page-Level Protection
```typescript
// AutomationPage.tsx
if (user?.role !== "ORG_ADMIN" && user?.role !== "SUPER_ADMIN") {
  return <Navigate to="/dashboard" replace />;
}
```

#### Sidebar Protection
```typescript
// AppSidebar.tsx
{
  to: "/automation",
  icon: Zap,
  label: "Automation",
  allowedRoles: ["SUPER_ADMIN", "ORG_ADMIN"],  // Not visible to AGENT
}
```

#### Behavior
- **AGENT**: Cannot see sidebar link, redirected to /dashboard if URL accessed directly
- **ORG_ADMIN**: Full CRUD access
- **SUPER_ADMIN**: Full CRUD access

---

## Component: AutomationFormDialog

### Features
- ✅ Create and edit automation rules
- ✅ Dynamic form controls based on condition/action selection
- ✅ Auto-clearing of values when switching to options that don't need them
- ✅ Validation with detailed error messages
- ✅ Loads priorities from API for priority selects
- ✅ Loads users from API for agent assignment
- ✅ URL validation for webhook action
- ✅ Error handling with alerts
- ✅ Loading states

### Form Structure
1. **Name** (text input, 2-100 chars)
2. **Trigger** (select - "When")
3. **Condition** (select - "If")
4. **Condition Value** (dynamic control, conditionally rendered)
5. **Action** (select - "Then")
6. **Action Value** (dynamic control, conditionally rendered)

### Complex Validation
```typescript
.superRefine((data, ctx) => {
  // Validate conditionValue based on condition
  if (data.condition === "STATUS_IS" || data.condition === "PRIORITY_IS") {
    if (!data.conditionValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Condition value is required for ${data.condition}`,
        path: ["conditionValue"],
      });
    }
  }
  
  // Validate actionValue based on action
  // ... similar logic
  
  // Validate URL for WEBHOOK
  if (data.action === "WEBHOOK") {
    try {
      new URL(data.actionValue);
    } catch {
      ctx.addIssue({ /* invalid URL */ });
    }
  }
});
```

---

## Component: AutomationTable

### Features
- ✅ Displays all automation rules
- ✅ Shows trigger, condition, action with values
- ✅ Enable/disable toggle (Power icon)
- ✅ Edit button
- ✅ Delete button with confirmation
- ✅ Search with 300ms debounce
- ✅ Pagination
- ✅ Loading states
- ✅ Empty state

### Columns
1. **Name** - Rule name (bold)
2. **Trigger** - Human-readable trigger label
3. **Condition** - Condition label + value (if applicable)
4. **Action** - Action label + value (truncated if long)
5. **Status** - Badge (Enabled/Disabled)
6. **Actions** - Enable/Disable, Edit, Delete buttons

---

## Utility: useDebounce Hook

Created a reusable debounce hook for search inputs:

```typescript
useDebounce(
  () => {
    onSearchChange(localSearch);
  },
  300,
  [localSearch]
);
```

**Location**: `client/src/hooks/useDebounce.ts`  
**Usage**: Prevents excessive API calls while user is typing

---

## React Query Integration

### Cache Strategy
- **List Query**: Uses `placeholderData` to prevent loading flash during pagination
- **Mutations**: All mutations invalidate `automationKeys.all` on success
- **Hierarchical Keys**: `all` > `lists` > `list(params)` > `details` > `detail(id)`

### Mutations
All 5 mutations follow the same pattern:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: automationKeys.all });
}
```

---

## Testing Checklist

### Manual Testing
- [ ] As ORG_ADMIN: See "Automation" in sidebar
- [ ] As AGENT: Do NOT see "Automation" in sidebar
- [ ] As AGENT: Navigate to /automation → redirected to /dashboard
- [ ] Create automation rule with all field types
- [ ] Switch condition → see appropriate input control
- [ ] Switch action → see appropriate input control
- [ ] Submit with missing required values → validation errors
- [ ] Submit with invalid webhook URL → validation error
- [ ] Edit existing automation rule
- [ ] Enable/disable automation rule
- [ ] Delete automation rule with confirmation
- [ ] Search automation rules (debounced)
- [ ] Paginate through automation rules

### Condition Value Testing
- [ ] ALWAYS → no input (value null)
- [ ] STATUS_IS → status select appears
- [ ] PRIORITY_IS → priority select appears (with colors)
- [ ] UNASSIGNED → no input (value null)
- [ ] RESPONSE_BREACHED → no input (value null)
- [ ] RESOLUTION_BREACHED → no input (value null)

### Action Value Testing
- [ ] ASSIGN_AGENT → user select appears
- [ ] CHANGE_STATUS → status select appears
- [ ] CHANGE_PRIORITY → priority select appears (with colors)
- [ ] ADD_COMMENT → textarea appears
- [ ] CLOSE_TICKET → no input (value null)
- [ ] REOPEN_TICKET → no input (value null)
- [ ] SEND_NOTIFICATION → textarea appears
- [ ] SEND_EMAIL → textarea appears
- [ ] WEBHOOK → URL input appears, validates format

---

## Build Status

✅ **TypeScript**: No errors  
✅ **Production Build**: Success (724.46 kB)  
✅ **All Patterns**: Follow established conventions

---

## Key Achievements

1. **Dynamic Form Controls**: Successfully implemented complex form that changes controls based on enum selections
2. **Role-Based Access**: First module with strict ORG_ADMIN-only access (not even GET for AGENT)
3. **Smart Validation**: Zod superRefine validates conditionally based on selections
4. **Auto-Clearing**: Form intelligently clears values when switching to options that don't need them
5. **Reusable Hook**: Created useDebounce hook for better UX

---

## Future Enhancements

1. **Rule Testing**: Add "Test Rule" button to simulate execution
2. **Rule History**: Show execution history/logs
3. **Rule Ordering**: Add priority/ordering for multiple matching rules
4. **Rule Templates**: Pre-configured templates for common use cases
5. **Bulk Operations**: Enable/disable multiple rules at once
6. **Rule Analytics**: Show how often rules are triggered

---

## Conclusion

The automation feature is fully implemented with a sophisticated dynamic form that adapts its controls based on user selections. The module is properly restricted to ORG_ADMIN users at both the route and UI level, following security best practices. All established patterns from previous phases are maintained.

**Key Technical Achievement**: The dynamic form control system that maps enum values to appropriate UI controls (Select, Textarea, Input[url], or none) with proper validation and auto-clearing behavior.
