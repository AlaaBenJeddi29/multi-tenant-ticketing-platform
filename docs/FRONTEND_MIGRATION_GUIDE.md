# Frontend Migration Guide - API Pagination Changes

## Overview

All list endpoints now return paginated responses with metadata. This guide helps frontend developers migrate to the new API structure.

## Breaking Changes

### Before (Old Response)
```json
[
  { "id": "1", "name": "Category 1" },
  { "id": "2", "name": "Category 2" }
]
```

### After (New Response)
```json
{
  "data": [
    { "id": "1", "name": "Category 1" },
    { "id": "2", "name": "Category 2" }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Migration Steps

### 1. Update API Response Types

**Before:**
```typescript
// Old type
type Category = {
  id: string;
  name: string;
  // ...
};

type CategoriesResponse = Category[];
```

**After:**
```typescript
// New types
type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

type Category = {
  id: string;
  name: string;
  // ...
};

type CategoriesResponse = PaginatedResponse<Category>;
```

### 2. Update API Calls

**Before:**
```typescript
async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');
  return response.json();
}
```

**After:**
```typescript
async function getCategories(
  page = 1,
  pageSize = 20,
  filters?: CategoryFilters
): Promise<PaginatedResponse<Category>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(filters?.search && { search: filters.search }),
    ...(filters?.isActive !== undefined && { 
      isActive: filters.isActive.toString() 
    }),
  });
  
  const response = await fetch(`/api/categories?${params}`);
  return response.json();
}
```

### 3. Update Component State

**Before:**
```typescript
const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
  getCategories().then(setCategories);
}, []);
```

**After:**
```typescript
const [categories, setCategories] = useState<Category[]>([]);
const [pagination, setPagination] = useState<PaginationMeta | null>(null);
const [page, setPage] = useState(1);

useEffect(() => {
  getCategories(page, 20).then(response => {
    setCategories(response.data);
    setPagination(response.meta);
  });
}, [page]);
```

### 4. React Query Migration

**Before:**
```typescript
const { data: categories } = useQuery({
  queryKey: ['categories'],
  queryFn: getCategories,
});
```

**After:**
```typescript
const [page, setPage] = useState(1);
const [filters, setFilters] = useState<CategoryFilters>({});

const { data, isLoading } = useQuery({
  queryKey: ['categories', page, filters],
  queryFn: () => getCategories(page, 20, filters),
});

const categories = data?.data || [];
const meta = data?.meta;
```

### 5. Add Pagination Controls

```typescript
function PaginationControls({ meta, onPageChange }: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Showing {(meta.page - 1) * meta.pageSize + 1} to{' '}
        {Math.min(meta.page * meta.pageSize, meta.total)} of {meta.total} results
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        <span className="px-3 py-1">
          Page {meta.page} of {meta.totalPages}
        </span>
        
        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page === meta.totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### 6. Add Filters UI

```typescript
function CategoriesFilter({ 
  filters, 
  onFilterChange 
}: {
  filters: CategoryFilters;
  onFilterChange: (filters: CategoryFilters) => void;
}) {
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Search categories..."
        value={filters.search || ''}
        onChange={(e) => onFilterChange({ 
          ...filters, 
          search: e.target.value 
        })}
        className="px-3 py-2 border rounded"
      />
      
      <select
        value={filters.isActive === undefined ? 'all' : filters.isActive.toString()}
        onChange={(e) => {
          const value = e.target.value;
          onFilterChange({
            ...filters,
            isActive: value === 'all' ? undefined : value === 'true',
          });
        }}
        className="px-3 py-2 border rounded"
      >
        <option value="all">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  );
}
```

## Complete Example Component

```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type Category = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

type CategoryFilters = {
  search?: string;
  isActive?: boolean;
};

function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState<CategoryFilters>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories', page, pageSize, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortBy: 'name',
        sortOrder: 'asc',
      });
      
      if (filters.search) params.append('search', filters.search);
      if (filters.isActive !== undefined) {
        params.append('isActive', filters.isActive.toString());
      }
      
      const response = await fetch(`/api/categories?${params}`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  const categories = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      
      {/* Filters */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={filters.search || ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-4 py-2 border rounded-lg w-full max-w-md"
        />
      </div>
      
      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b">
              <td className="p-3">{category.name}</td>
              <td className="p-3">{category.description || '-'}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      {meta && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(meta.page - 1) * meta.pageSize + 1} to{' '}
            {Math.min(meta.page * meta.pageSize, meta.total)} of{' '}
            {meta.total} results
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={meta.page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <div className="flex items-center px-4">
              Page {meta.page} of {meta.totalPages}
            </div>
            
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={meta.page === meta.totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Reusable Hooks

### usePaginatedQuery Hook

```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function usePaginatedQuery<T, F = Record<string, any>>({
  queryKey,
  endpoint,
  defaultPageSize = 20,
  defaultFilters,
}: {
  queryKey: string;
  endpoint: string;
  defaultPageSize?: number;
  defaultFilters?: F;
}) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(defaultPageSize);
  const [filters, setFilters] = useState<F>(defaultFilters || {} as F);

  const query = useQuery({
    queryKey: [queryKey, page, pageSize, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      
      Object.entries(filters as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      
      const response = await fetch(`${endpoint}?${params}`);
      if (!response.ok) throw new Error(`Failed to fetch ${queryKey}`);
      return response.json();
    },
  });

  return {
    data: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
    page,
    setPage,
    filters,
    setFilters,
  };
}
```

### Usage:

```typescript
function CategoriesPage() {
  const {
    data: categories,
    meta,
    isLoading,
    page,
    setPage,
    filters,
    setFilters,
  } = usePaginatedQuery<Category, CategoryFilters>({
    queryKey: 'categories',
    endpoint: '/api/categories',
    defaultFilters: { isActive: true },
  });

  // ... render component
}
```

## Testing Considerations

### Update API Mocks

**Before:**
```typescript
// Mock
server.use(
  rest.get('/api/categories', (req, res, ctx) => {
    return res(ctx.json(mockCategories));
  })
);
```

**After:**
```typescript
// Mock
server.use(
  rest.get('/api/categories', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const pageSize = Number(req.url.searchParams.get('pageSize')) || 20;
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = mockCategories.slice(start, end);
    
    return res(ctx.json({
      data,
      meta: {
        page,
        pageSize,
        total: mockCategories.length,
        totalPages: Math.ceil(mockCategories.length / pageSize),
      },
    }));
  })
);
```

## Common Pitfalls

### 1. Forgetting to Access `.data`
❌ **Wrong:**
```typescript
const categories = response; // This is the whole response object
```

✅ **Correct:**
```typescript
const categories = response.data; // This is the array
```

### 2. Not Resetting Page on Filter Change
❌ **Wrong:**
```typescript
setFilters(newFilters); // Page stays the same, might show empty results
```

✅ **Correct:**
```typescript
setFilters(newFilters);
setPage(1); // Reset to first page
```

### 3. Boolean Filter Serialization
❌ **Wrong:**
```typescript
params.append('isActive', filters.isActive); // Sends boolean directly
```

✅ **Correct:**
```typescript
if (filters.isActive !== undefined) {
  params.append('isActive', filters.isActive.toString());
}
```

## Rollout Strategy

1. **Phase 1**: Update API response type definitions
2. **Phase 2**: Create reusable pagination components and hooks
3. **Phase 3**: Migrate one module at a time (start with least critical)
4. **Phase 4**: Update tests for each migrated module
5. **Phase 5**: Deploy and monitor

## Need Help?

- Check `PAGINATION_QUICK_REFERENCE.md` for endpoint-specific filters
- Review `PAGINATION_IMPLEMENTATION_SUMMARY.md` for backend details
- Contact backend team for API-related questions
