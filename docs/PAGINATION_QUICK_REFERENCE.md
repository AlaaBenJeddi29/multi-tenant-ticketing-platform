# Pagination Quick Reference Guide

## Standard Response Format

All list endpoints now return:
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Common Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (min: 1) |
| `pageSize` | number | 20 | Items per page (min: 1, max: 100) |
| `sortOrder` | "asc" \| "desc" | "desc" | Sort direction |

## Endpoint-Specific Filters

### Categories: `GET /api/categories`
```
?search=hardware
&isActive=true
&sortBy=name|createdAt|updatedAt  (default: createdAt)
```

### Priorities: `GET /api/priorities`
```
?search=urgent
&level=LOW|MEDIUM|HIGH|CRITICAL
&isActive=true
&sortBy=name|level|createdAt  (default: createdAt)
```

### Assets: `GET /api/assets`
```
?search=laptop  (searches name & assetTag)
&status=ACTIVE|IN_MAINTENANCE|RETIRED
&sortBy=name|status|createdAt  (default: createdAt)
```

### Requesters: `GET /api/requesters`
```
?search=john  (searches firstName, lastName, email, company)
&isActive=true
&sortBy=lastName|createdAt  (default: createdAt)
```

### Tickets: `GET /api/tickets`
```
?search=login  (searches title)
&status=NEW|IN_PROGRESS|WAITING_REQUESTER|RESOLVED|CLOSED
&priorityId=abc123
&categoryId=def456
&assignedToId=user123  (or "unassigned" for null)
&requesterId=req789
&sortBy=createdAt|updatedAt|ticketNumber|responseDueAt|resolutionDueAt
```

### SLAs: `GET /api/slas`
```
?search=critical
&isActive=true
&sortBy=name|createdAt  (default: createdAt)
```

### Comments: `GET /api/comments/ticket/:ticketId`
```
(Only pagination - sortBy fixed to createdAt asc)
```

### Automation Rules: `GET /api/automation`
```
?search=auto-assign
&trigger=TICKET_CREATED|TICKET_UPDATED|COMMENT_CREATED|STATUS_CHANGED|SLA_BREACHED
&enabled=true
&sortBy=name|createdAt  (default: createdAt)
```

### Users: `GET /api/users`
```
?search=jane  (searches firstName, lastName, email)
&role=SUPER_ADMIN|ORG_ADMIN|AGENT
&isActive=true
&sortBy=lastName|createdAt  (default: createdAt)
```

### Notifications: `GET /api/notifications`
```
?isRead=false
(sortBy fixed to createdAt desc)
```

## Example Requests

### Get first page of active categories
```bash
curl "http://localhost:3000/api/categories?isActive=true&page=1&pageSize=20"
```

### Search for unassigned high-priority tickets
```bash
curl "http://localhost:3000/api/tickets?assignedToId=unassigned&priorityId=high-priority-id&sortBy=createdAt&sortOrder=desc"
```

### Get users sorted by last name
```bash
curl "http://localhost:3000/api/users?sortBy=lastName&sortOrder=asc&isActive=true"
```

### Search requesters by company name
```bash
curl "http://localhost:3000/api/requesters?search=acme&page=1&pageSize=50"
```

## Frontend Integration Tips

### React Query Example
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['tickets', { page, filters }],
  queryFn: async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: '20',
      ...filters,
    });
    const response = await fetch(`/api/tickets?${params}`);
    return response.json();
  },
});

// Access data
const tickets = data?.data || [];
const totalPages = data?.meta.totalPages || 0;
```

### Building Query Strings
```typescript
function buildQueryString(filters: Record<string, any>): string {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  
  return params.toString();
}

// Usage
const queryString = buildQueryString({
  page: 1,
  pageSize: 20,
  search: 'laptop',
  isActive: true,
});

fetch(`/api/assets?${queryString}`);
```

## Special Cases

### Unassigned Tickets
To filter for unassigned tickets, use the literal string `"unassigned"`:
```bash
GET /api/tickets?assignedToId=unassigned
```

### Fixed Sorting
- **Comments**: Always sorted by `createdAt` ascending (oldest first)
- **Notifications**: Always sorted by `createdAt` descending (newest first)

## Performance Considerations

- **Default Page Size**: 20 items (good balance for most UIs)
- **Maximum Page Size**: 100 items (prevents overloading)
- **Database Queries**: Uses parallel execution for count and data fetch
- **Indexes**: Ensure your Prisma schema has indexes on frequently sorted/filtered fields

## Error Handling

### Invalid Query Parameters
```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "pageSize",
      "message": "Number must be less than or equal to 100"
    }
  ]
}
```

### Common Validation Rules
- `page` must be >= 1
- `pageSize` must be between 1 and 100
- `sortOrder` must be "asc" or "desc"
- Enum fields must match exact values (case-sensitive)
- Boolean fields are coerced (accepts "true"/"false", "1"/"0", true/false)
