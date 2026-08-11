# Categories Feature - Quick Reference

## File Structure

```
src/
├── types/
│   └── pagination.types.ts          ← Generic (all features)
└── features/categories/
    ├── api/
    │   ├── category.api.ts           ← 7 API functions
    │   └── category.queryKeys.ts     ← Hierarchical keys
    ├── components/
    │   ├── CategoryTable.tsx         ← List + search + pagination
    │   └── CategoryFormDialog.tsx    ← Create/edit form
    ├── hooks/
    │   ├── useCategories.ts          ← List query
    │   ├── useCategory.ts            ← Detail query
    │   ├── useCreateCategory.ts      ← Create mutation
    │   ├── useUpdateCategory.ts      ← Update mutation
    │   ├── useActivateCategory.ts    ← Activate mutation
    │   ├── useDeactivateCategory.ts  ← Deactivate mutation
    │   └── useDeleteCategory.ts      ← Delete mutation
    ├── pages/
    │   └── CategoriesPage.tsx        ← Main page
    ├── schemas/
    │   └── category.schema.ts        ← Zod validation
    ├── types/
    │   └── category.types.ts         ← TypeScript types
    └── index.ts                      ← Barrel exports
```

## Key Patterns

### 1. Generic Pagination Types (Shared Across All Features)

**Location:** `src/types/pagination.types.ts`

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
```

### 2. Hierarchical Query Keys

```typescript
export const categoryKeys = {
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
  list: (params) => [...categoryKeys.lists(), params],
  details: () => [...categoryKeys.all, "detail"],
  detail: (id) => [...categoryKeys.details(), id],
};
```

**Usage:**
- Invalidate everything: `categoryKeys.all`
- Invalidate all lists: `categoryKeys.lists()`
- Specific list cache: `categoryKeys.list({ page: 1, search: "hardware" })`
- Specific detail cache: `categoryKeys.detail("123")`

### 3. Placeholder Data (No Loading Flash)

```typescript
useQuery({
  queryKey: categoryKeys.list(params),
  queryFn: () => getCategories(params),
  placeholderData: (previousData) => previousData, // ← Keep old data while loading
});
```

### 4. Debounced Search

```typescript
const [searchInput, setSearchInput] = useState(search);

useEffect(() => {
  const timer = setTimeout(() => {
    onSearchChange(searchInput); // Update after 300ms
  }, 300);
  return () => clearTimeout(timer);
}, [searchInput, onSearchChange]);
```

### 5. Dual-Mode Dialog (Create + Edit)

```typescript
// Create mode: category = null
<CategoryFormDialog open={open} onOpenChange={setOpen} category={null} />

// Edit mode: category = data
<CategoryFormDialog open={open} onOpenChange={setOpen} category={selectedCategory} />
```

**Inside Dialog:**
```typescript
const isEditMode = !!category;

// Prefill form in edit mode
reset({
  name: category?.name || "",
  description: category?.description || "",
});

// Different submit logic
if (isEditMode) {
  updateMutation.mutateAsync({ id: category.id, input });
} else {
  createMutation.mutateAsync(input);
}
```

### 6. Role-Based UI

```typescript
const { user } = useAuth();
const isAdmin = user?.role === "ORG_ADMIN" || user?.role === "SUPER_ADMIN";

{isAdmin && (
  <Button onClick={handleNewCategory}>New Category</Button>
)}

{isAdmin && (
  <TableCell>
    <Button onClick={() => onEditCategory(category)}>Edit</Button>
    <Button onClick={() => handleToggleActive(category)}>Toggle</Button>
    <Button onClick={() => handleDelete(category.id)}>Delete</Button>
  </TableCell>
)}
```

### 7. Cache Invalidation on Mutations

```typescript
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input) => createCategory(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }); // ← Refetch everything
    },
  });
}
```

**Result:** All lists and details automatically refetch after create/update/delete.

## Component Props Patterns

### CategoryTable

```typescript
<CategoryTable
  categories={data?.data || []}                  // Array of categories
  meta={data?.meta || defaultMeta}               // Pagination metadata
  isLoading={isLoading}                          // Loading state
  search={search}                                // Current search value
  onSearchChange={(search) => setSearch(search)} // Search callback
  onPageChange={(page) => setPage(page)}         // Page change callback
  onEditCategory={(cat) => handleEdit(cat)}      // Edit callback
/>
```

### CategoryFormDialog

```typescript
<CategoryFormDialog
  open={dialogOpen}                  // Dialog open state
  onOpenChange={setDialogOpen}       // Open/close callback
  category={selectedCategory}        // null = create, object = edit
/>
```

## API Functions

```typescript
// Query
getCategories(params: CategoryListParams): Promise<CategoriesResponse>
getCategoryById(id: string): Promise<Category>

// Mutations
createCategory(input: CreateCategoryInput): Promise<Category>
updateCategory(id: string, input: UpdateCategoryInput): Promise<Category>
activateCategory(id: string): Promise<Category>
deactivateCategory(id: string): Promise<Category>
deleteCategory(id: string): Promise<void>
```

## Hook Usage Examples

### Fetch List

```typescript
const { data, isLoading, error } = useCategories({
  page: 1,
  pageSize: 20,
  sortBy: "name",
  sortOrder: "asc",
  search: "hardware", // optional
  isActive: true,     // optional
});

// Access data
const categories = data?.data || [];
const meta = data?.meta;
```

### Fetch Single

```typescript
const { data: category, isLoading } = useCategory("category-id");
```

### Create

```typescript
const createMutation = useCreateCategory();

const handleCreate = async () => {
  try {
    await createMutation.mutateAsync({
      name: "Hardware",
      description: "Hardware issues",
    });
    // Success - cache invalidated, list refetches
  } catch (error) {
    // Error - handled by React Query
  }
};

// Check mutation state
createMutation.isPending  // true while creating
createMutation.isError    // true if failed
createMutation.isSuccess  // true if succeeded
```

### Update

```typescript
const updateMutation = useUpdateCategory();

const handleUpdate = async () => {
  await updateMutation.mutateAsync({
    id: "category-id",
    input: { name: "New Name" },
  });
};
```

### Toggle Active

```typescript
const activateMutation = useActivateCategory();
const deactivateMutation = useDeactivateCategory();

const handleToggle = (category: Category) => {
  if (category.isActive) {
    deactivateMutation.mutate(category.id);
  } else {
    activateMutation.mutate(category.id);
  }
};
```

### Delete

```typescript
const deleteMutation = useDeleteCategory();

const handleDelete = (id: string) => {
  if (confirm("Are you sure?")) {
    deleteMutation.mutate(id);
  }
};
```

## Form Validation

### Schema

```typescript
export const categoryFormSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  description: z.string().max(255).trim().optional().or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
```

### Usage with React Hook Form

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm<CategoryFormValues>({
  resolver: zodResolver(categoryFormSchema),
});

const onSubmit = async (data: CategoryFormValues) => {
  await createMutation.mutateAsync(data);
};
```

### Display Errors

```typescript
<Input {...register("name")} aria-invalid={!!errors.name} />
<FieldError errors={[errors.name]} />
```

## Page State Management

```typescript
export default function CategoriesPage() {
  // Query params state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Fetch data
  const { data, isLoading } = useCategories({ page, search });

  // Handlers
  const handleNewCategory = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to page 1 on search
  };

  return (
    <>
      <CategoryTable
        categories={data?.data || []}
        meta={data?.meta || defaultMeta}
        isLoading={isLoading}
        search={search}
        onSearchChange={handleSearchChange}
        onPageChange={setPage}
        onEditCategory={handleEditCategory}
      />

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
      />
    </>
  );
}
```

## Styling

### Table Row Hover

```typescript
<TableRow className="hover:bg-muted/50">
```

### Badge Variants

```typescript
<Badge variant={category.isActive ? "secondary" : "outline"}>
  {category.isActive ? "Active" : "Inactive"}
</Badge>
```

### Button Sizes

```typescript
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="icon-sm">Icon</Button>
```

### Button Variants

```typescript
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="destructive">Danger</Button>
```

## Common Patterns for Other CRUD Features

### 1. Copy Categories Structure

```bash
cp -r features/categories features/priorities
# Update all imports and names: Category → Priority
```

### 2. Update Types

```typescript
export interface Priority {
  id: string;
  name: string;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  responseTime: number;
  resolutionTime: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 3. Update API Endpoints

```typescript
const BASE_URL = "/priorities"; // Change from /categories
```

### 4. Update Query Keys

```typescript
export const priorityKeys = {
  all: ["priorities"], // Change from "categories"
  // ... rest follows same pattern
};
```

### 5. Update Validation Schema

```typescript
export const priorityFormSchema = z.object({
  name: z.string().min(2).max(100),
  level: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  responseTime: z.number().min(1),
  resolutionTime: z.number().min(1),
  // ... priority-specific fields
});
```

### 6. Update Table Columns

```typescript
<TableHead>Name</TableHead>
<TableHead>Level</TableHead>
<TableHead>Response Time</TableHead>
<TableHead>Resolution Time</TableHead>
<TableHead>Status</TableHead>
<TableHead>Actions</TableHead>
```

### 7. Update Form Fields

```typescript
<Field>
  <FieldLabel>Priority Level</FieldLabel>
  <select {...register("level")}>
    <option value="LOW">Low</option>
    <option value="MEDIUM">Medium</option>
    <option value="HIGH">High</option>
    <option value="CRITICAL">Critical</option>
  </select>
</Field>
```

## Troubleshooting

### Table doesn't update after mutation
- ✅ Check `onSuccess` calls `invalidateQueries({ queryKey: categoryKeys.all })`

### Search doesn't debounce
- ✅ Check `useEffect` with `setTimeout` is present
- ✅ Check cleanup function returns `clearTimeout`

### Form shows old data
- ✅ Check `useEffect` with `open` dependency calls `reset()`

### Pagination shows wrong page
- ✅ Check `meta` structure matches `{ page, pageSize, total, totalPages }`

### Actions visible to non-admins
- ✅ Check `isAdmin` logic wraps action buttons

## Testing Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
tsc --noEmit
```

## Quick Copy-Paste Snippets

### New Mutation Hook

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSomething } from "../api/something.api";
import { somethingKeys } from "../api/something.queryKeys";

export function useCreateSomething() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateInput) => createSomething(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: somethingKeys.all });
    },
  });
}
```

### New Query Hook

```typescript
import { useQuery } from "@tanstack/react-query";
import { getSomethings } from "../api/something.api";
import { somethingKeys } from "../api/something.queryKeys";

export function useSomethings(params: ListParams) {
  return useQuery({
    queryKey: somethingKeys.list(params),
    queryFn: () => getSomethings(params),
    placeholderData: (previousData) => previousData,
  });
}
```

### New API Function

```typescript
export async function createSomething(input: CreateInput): Promise<Something> {
  const response = await api.post<Something>("/somethings", input);
  return response.data;
}
```

---

**The Categories feature is complete and ready for production use!** 🎉

Use this structure as a template for Priorities, Assets, Requesters, and other CRUD features.

