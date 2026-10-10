# Pagination, Filtering, and Sorting Implementation Summary

## Overview

Implemented comprehensive pagination, filtering, and sorting across all list endpoints in the Express + Prisma backend. All endpoints now return a consistent paginated response structure with metadata.

## Response Contract

All list endpoints now return:

```typescript
{
  data: T[],           // Array of items
  meta: {
    page: number,      // Current page number
    pageSize: number,  // Items per page
    total: number,     // Total count of items
    totalPages: number // Total number of pages
  }
}
```

## Query Parameters (Common)

- `page` (default: 1) - Page number
- `pageSize` (default: 20, max: 100) - Items per page
- `sortOrder` ("asc" | "desc", default: "desc") - Sort direction
- `sortBy` - Module-specific sort field (see below)
- Additional filters per module (see below)

## Shared Library

### `src/lib/pagination.ts`

Created shared pagination utilities:
- `paginationQuerySchema` - Zod schema for common pagination params
- `buildMeta()` - Builds pagination metadata object
- `getSkipTake()` - Calculates Prisma skip/take values
- `PaginatedResponse<T>` - TypeScript type for paginated responses

## Module-by-Module Implementation

### 1. Categories (`/api/categories`)

**Filters:**
- `search` - Case-insensitive search on name
- `isActive` - Boolean filter

**Sort Options:**
- `name`, `createdAt`, `updatedAt` (default: `createdAt`)

**Files Modified:**
- ✅ `dto/list-categories.dto.ts` (created)
- ✅ `repositories/categories.repository.ts`
- ✅ `services/categories.service.ts`
- ✅ `mappers/category.mapper.ts`
- ✅ `controller/categories.controller.ts`

---

### 2. Priorities (`/api/priorities`)

**Filters:**
- `search` - Case-insensitive search on name
- `level` - PriorityLevel enum (LOW, MEDIUM, HIGH, CRITICAL)
- `isActive` - Boolean filter

**Sort Options:**
- `name`, `level`, `createdAt` (default: `createdAt`)

**Files Modified:**
- ✅ `dto/list-priorities.dto.ts` (created)
- ✅ `repositories/priorities.repository.ts`
- ✅ `services/priorities.service.ts`
- ✅ `mappers/priority.mapper.ts`
- ✅ `controller/priorities.controller.ts`

---

### 3. Assets (`/api/assets`)

**Filters:**
- `search` - Case-insensitive search on name OR assetTag
- `status` - AssetStatus enum (ACTIVE, IN_MAINTENANCE, RETIRED)

**Sort Options:**
- `name`, `status`, `createdAt` (default: `createdAt`)

**Files Modified:**
- ✅ `dto/list-assets.dto.ts` (created)
- ✅ `repositories/assets.repository.ts`
- ✅ `services/assets.service.ts`
- ✅ `mappers/asset.mapper.ts`
- ✅ `controller/assets.controller.ts`

---

### 4. Requesters (`/api/requesters`)

**Filters:**
- `search` - Case-insensitive search on firstName, lastName, email, OR company
- `isActive` - Boolean filter

**Sort Options:**
- `lastName`, `createdAt` (default: `createdAt`)

**Files Modified:**
- ✅ `dto/list-requesters.dto.ts` (created)
- ✅ `repositories/requester.respoitroy.ts`
- ✅ `services/requester.service.ts`
- ✅ `mappers/requester.mapper.ts`
- ✅ `controllers/requester.controller.ts`

---

### 5. Tickets (`/api/tickets`)

**Filters:**
- `search` - Case-insensitive search on title
- `status` - TicketStatus enum
- `priorityId` - Filter by priority ID
- `categoryId` - Filter by category ID
- `assignedToId` - Filter by assigned user ID (supports special literal `"unassigned"` for null)
- `requesterId` - Filter by requester ID

**Sort Options:**
- `createdAt`, `updatedAt`, `ticketNumber`, `responseDueAt`, `resolutionDueAt` (default: `createdAt`)

**Special Feature:**
- `assignedToId: "unassigned"` filters for tickets with `assignedToId = null`

**Files Modified:**
- ✅ `dto/list-tickets.dto.ts` (created)
- ✅ `repositories/ticket.repository.ts`
- ✅ `services/ticket.service.ts`
- ✅ `mappers/ticket.mapper.ts`
- ✅ `controllers/ticket.controller.ts`

---

### 6. SLAs (`/api/slas`)

**Filters:**
- `search` - Case-insensitive search on name
- `isActive` - Boolean filter

**Sort Options:**
- `name`, `createdAt` (default: `createdAt`)

**Files Modified:**
- ✅ `dto/list-slas.dto.ts` (created)
- ✅ `repositories/sla.repository.ts`
- ✅ `services/sla.service.ts`
- ✅ `mappers/sla.mapper.ts`
- ✅ `controllers/sla.controller.ts`

---

### 7. Comments (`/api/comments/ticket/:ticketId`)

**Filters:**
- None (only pagination)

**Sort Options:**
- Fixed to `createdAt` ascending (oldest first for thread continuity)

**Special Notes:**
- Sort order is hardcoded to show comments chronologically
- Route is nested under ticket ID

**Files Modified:**
- ✅ `dto/list-comments.dto.ts` (created)
- ✅ `repositories/comment.repository.ts`
- ✅ `services/comment.service.ts`
- ✅ `mappers/comment.mapper.ts`
- ✅ `controllers/comment.controller.ts`

---

### 8. Automation Rules (`/api/automation`)

**Filters:**
- `search` - Case-insensitive search on name
- `trigger` - AutomationTrigger enum
- `enabled` - Boolean filter

**Sort Options:**
- `name`, `createdAt` (default: `createdAt`)

**Files Modified:**
- ✅ `dto/list-automation-rules.dto.ts` (created)
- ✅ `repositories/automation.repository.ts`
- ✅ `services/automation.service.ts`
- ✅ `mappers/automation.mapper.ts`
- ✅ `controllers/automation.controller.ts`

---

### 9. Users (`/api/users`)

**Filters:**
- `search` - Case-insensitive search on firstName, lastName, OR email
- `role` - Role enum (SUPER_ADMIN, ORG_ADMIN, AGENT)
- `isActive` - Boolean filter

**Sort Options:**
- `lastName`, `createdAt` (default: `createdAt`)

**Files Modified:**
- ✅ `dto/list-users.dto.ts` (created)
- ✅ `repositories/users.repository.ts`
- ✅ `services/users.service.ts`
- ✅ `mappers/user.mapper.ts`
- ✅ `controllers/users.controller.ts`

---

### 10. Notifications (`/api/notifications`)

**Filters:**
- `isRead` - Boolean filter

**Sort Options:**
- Fixed to `createdAt` descending (newest first)

**Special Notes:**
- The dedicated `/unread` endpoint remains unchanged
- Sort order is hardcoded to show newest notifications first

**Files Modified:**
- ✅ `dto/list-notifications.dto.ts` (created)
- ✅ `repositories/notification.repository.ts`
- ✅ `services/notification.service.ts`
- ✅ `mappers/notification.mapper.ts`
- ✅ `controllers/notification.controller.ts`

---

## Technical Implementation Pattern

Each module follows this consistent pattern:

### 1. DTO Layer
```typescript
// list-{module}.dto.ts
import { z } from "zod";
import { paginationQuerySchema } from "../../../lib/pagination.js";

export const list{Module}QuerySchema = paginationQuerySchema.extend({
  // Module-specific filters
  search: z.string().trim().optional(),
  // ... other filters
  sortBy: z.enum([...]).default("createdAt"),
});
```

### 2. Repository Layer
```typescript
// {module}.repository.ts
export async function find{Module}s(
  organizationId: string,
  query: List{Module}Query
) {
  const where: Prisma.{Module}WhereInput = { organizationId };
  
  // Build filters
  if (query.search) { /* ... */ }
  
  // Build orderBy
  const orderBy = { [query.sortBy]: query.sortOrder };
  
  // Paginate
  const { skip, take } = getSkipTake(query.page, query.pageSize);
  
  // Execute in parallel
  const [items, total] = await Promise.all([
    prisma.{module}.findMany({ where, orderBy, skip, take }),
    prisma.{module}.count({ where }),
  ]);
  
  return { items, total };
}
```

### 3. Service Layer
```typescript
// {module}.service.ts
export async function get{Module}s(
  organizationId: string,
  query: List{Module}Query
) {
  const { items, total } = await find{Module}s(organizationId, query);
  
  return to{Module}sListResponse({
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
  });
}
```

### 4. Mapper Layer
```typescript
// {module}.mapper.ts
export function to{Module}sListResponse({
  items,
  total,
  page,
  pageSize,
}: {
  items: {Module}[];
  total: number;
  page: number;
  pageSize: number;
}): PaginatedResponse<ReturnType<typeof to{Module}Response>> {
  return {
    data: items.map(to{Module}Response),
    meta: buildMeta(total, page, pageSize),
  };
}
```

### 5. Controller Layer
```typescript
// {module}.controller.ts
export async function get{Module}s(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query = list{Module}QuerySchema.parse(req.query);
    const {module}s = await {module}Service.get{Module}s(
      req.user!.organizationId,
      query
    );
    return res.status(200).json({module}s);
  } catch (error) {
    next(error);
  }
}
```

## Build Verification

✅ TypeScript compilation successful with no errors
✅ All modules maintain backward compatibility (single-item endpoints unchanged)
✅ Organization-level isolation preserved (all queries filtered by organizationId)

## Example Usage

### Basic Pagination
```bash
GET /api/categories?page=2&pageSize=10
```

### With Filtering
```bash
GET /api/tickets?status=IN_PROGRESS&priorityId=abc123&page=1&pageSize=20
```

### With Sorting
```bash
GET /api/users?sortBy=lastName&sortOrder=asc&isActive=true
```

### Search with Special Values
```bash
# Unassigned tickets
GET /api/tickets?assignedToId=unassigned

# Search across multiple fields
GET /api/requesters?search=acme
```

## Benefits

1. **Consistency** - All endpoints follow the same pagination contract
2. **Performance** - Efficient Prisma queries with parallel count execution
3. **Type Safety** - Full TypeScript coverage with Zod validation
4. **Flexibility** - Module-specific filters while maintaining common structure
5. **Scalability** - Configurable page sizes with sensible defaults and limits
6. **Developer Experience** - Clear, predictable API structure

## Notes

- All existing single-item endpoints (GET /:id, POST, PATCH, DELETE) remain unchanged
- Organization-level multi-tenancy isolation is maintained across all queries
- Default page size is 20 items, maximum is 100 items per page
- Case-insensitive search is used for all text-based filters
- Special handling for `assignedToId: "unassigned"` in tickets endpoint
