# App Shell Quick Reference

## What Was Built

A complete application shell with sidebar navigation for authenticated users.

## Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│  ┌────────────┬───────────────────────────────────────┐ │
│  │            │                                       │ │
│  │  Ticketing │  Main Content Area                    │ │
│  │  Platform  │  (Dashboard, Categories, etc.)        │ │
│  │            │                                       │ │
│  ├────────────┤                                       │ │
│  │            │                                       │ │
│  │ 📊 Dashboard│  <Outlet /> renders here             │ │
│  │ 📁 Categories                                      │ │
│  │ ⚠️  Priorities                                      │ │
│  │ 📦 Assets  │                                       │ │
│  │ 👥 Requesters                                      │ │
│  │            │                                       │ │
│  │            │                                       │ │
│  │            │                                       │ │
│  ├────────────┤                                       │ │
│  │ JD         │                                       │ │
│  │ John Doe   │                                       │ │
│  │ john@...   │                                       │ │
│  │ ──────────                                        │ │
│  │ 🚪 Logout  │                                       │ │
│  └────────────┴───────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Components

### AppSidebar
- **Location:** `src/components/common/AppSidebar.tsx`
- **Width:** 256px (w-64)
- **Features:**
  - Header with app title
  - Navigation with 5 links (Dashboard, Categories, Priorities, Assets, Requesters)
  - Active route highlighting
  - User profile section (avatar, name, email)
  - Logout button

### ProtectedLayout
- **Location:** `src/app/layouts/ProtectedLayout.tsx`
- **Layout:** Flex row (sidebar + main content)
- **Renders:** `<AppSidebar />` + `<Outlet />`

## Navigation Links

| Link | Route | Icon | Visible To |
|------|-------|------|------------|
| Dashboard | `/dashboard` | LayoutDashboard | All |
| Categories | `/categories` | Layers | All |
| Priorities | `/priorities` | AlertCircle | All |
| Assets | `/assets` | Package | All |
| Requesters | `/requesters` | Users | All |

**Future Links (Commented Placeholders):**
- Tickets (`/tickets`)
- SLAs (`/slas`) - Admin only
- Automation (`/automation`) - Admin only
- Users (`/users`) - Admin only
- Notifications (`/notifications`)

## Pages Created

All follow the same structure with a "Coming soon" message:

1. **CategoriesPage** - `src/features/categories/pages/CategoriesPage.tsx`
2. **PrioritiesPage** - `src/features/priorities/pages/PrioritiesPage.tsx`
3. **AssetsPage** - `src/features/assets/pages/AssetsPage.tsx`
4. **RequestersPage** - `src/features/requesters/pages/RequestersPage.tsx`

## Usage Example

```tsx
// The layout is automatically applied to all protected routes
// Users see the sidebar on every authenticated page

// In AppRouter.tsx:
{
  element: <RequireAuth />,
  children: [
    {
      element: <ProtectedLayout />, // ← Sidebar here
      children: [
        { path: "/dashboard", element: <DashboardPage /> },
        { path: "/categories", element: <CategoriesPage /> },
        // etc.
      ],
    },
  ],
}
```

## Styling

Uses existing theme CSS variables:
- `--sidebar` - Background color
- `--sidebar-foreground` - Text color
- `--sidebar-primary` - Active link background
- `--sidebar-accent` - Hover background
- `--sidebar-border` - Border color

**States:**
- Default: `text-sidebar-foreground`
- Hover: `bg-sidebar-accent hover:text-sidebar-accent-foreground`
- Active: `bg-sidebar-primary text-sidebar-primary-foreground`

## Role-Based Visibility

```typescript
// Current: All links visible to all authenticated users
// Future: Use allowedRoles to restrict

const navItems: NavItem[] = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    // No allowedRoles = visible to all
  },
  {
    to: "/users",
    icon: UserCog,
    label: "Users",
    allowedRoles: ["SUPER_ADMIN", "ORG_ADMIN"], // ← Restrict
  },
];
```

## Active Link Detection

Uses React Router's `NavLink`:

```tsx
<NavLink
  to="/dashboard"
  className={({ isActive }) =>
    isActive
      ? "bg-sidebar-primary text-sidebar-primary-foreground"
      : "text-sidebar-foreground"
  }
>
  Dashboard
</NavLink>
```

## User Section

Displays:
- **Avatar:** Circular with initials (first letter of first + last name)
- **Name:** Full name from `user.firstName` + `user.lastName`
- **Email:** User's email (truncated if long)
- **Logout:** Button wired to `useLogout` hook

```tsx
const { user } = useAuth();

// Avatar shows: "JD" for "John Doe"
{user?.firstName?.[0]}{user?.lastName?.[0]}

// Name shows: "John Doe"
{user?.firstName} {user?.lastName}

// Email shows: "john@example.com"
{user?.email}
```

## Testing

### Visual Checks
```bash
npm run dev
# Navigate to http://localhost:5173
# Log in as any user
# Verify:
# - Sidebar appears
# - Navigation works
# - Active link is highlighted
# - User info displays
# - Logout works
```

### Build Check
```bash
npm run build
# Should complete with no errors
```

## Files Modified/Created

**Created:**
- ✅ `src/components/common/AppSidebar.tsx`
- ✅ `src/components/common/index.ts`
- ✅ `src/features/categories/pages/CategoriesPage.tsx`
- ✅ `src/features/priorities/pages/PrioritiesPage.tsx`
- ✅ `src/features/assets/pages/AssetsPage.tsx`
- ✅ `src/features/requesters/pages/RequestersPage.tsx`

**Updated:**
- ✅ `src/app/layouts/ProtectedLayout.tsx`
- ✅ `src/app/router/routes.ts`
- ✅ `src/app/router/AppRouter.tsx`

**Documentation:**
- ✅ `APP_SHELL_IMPLEMENTATION.md`
- ✅ `APP_SHELL_QUICK_REFERENCE.md` (this file)

## Next Steps

1. **Implement Page Content**
   - Build list views for Categories, Priorities, Assets, Requesters
   - Add create/edit forms
   - Wire up to backend APIs

2. **Add Remaining Navigation**
   - Uncomment placeholder links
   - Create corresponding pages
   - Apply role restrictions

3. **Enhance Sidebar**
   - Add mobile responsiveness
   - Add collapse/expand toggle
   - Add notification badges

4. **Role-Based UI Controls**
   - Hide create/edit buttons from AGENT role
   - Show admin-only features to admins

## Tips

### Adding a New Navigation Item

1. Add route to `routes.ts`:
   ```typescript
   TICKETS: "/tickets",
   ```

2. Create page component:
   ```tsx
   // src/features/tickets/pages/TicketsPage.tsx
   export default function TicketsPage() {
     return <div>Tickets</div>;
   }
   ```

3. Add route to `AppRouter.tsx`:
   ```tsx
   { path: ROUTES.TICKETS, element: <TicketsPage /> }
   ```

4. Add nav item to `AppSidebar.tsx`:
   ```typescript
   {
     to: "/tickets",
     icon: Ticket,
     label: "Tickets",
   }
   ```

### Restricting by Role

```typescript
{
  to: "/users",
  icon: UserCog,
  label: "Users",
  allowedRoles: ["SUPER_ADMIN", "ORG_ADMIN"], // Only admins
}
```

### Changing Sidebar Width

```tsx
// In AppSidebar.tsx, change:
<aside className="... w-64"> // ← Change w-64 to w-48, w-72, etc.
```

## Common Issues

### Sidebar Not Showing
- Check that you're on a protected route (requires authentication)
- Verify `RequireAuth` wrapper is in place
- Check browser console for errors

### Active Link Not Highlighting
- Ensure using `NavLink`, not `Link`
- Verify route matches exactly (including trailing slashes)
- Check theme CSS variables are loaded

### User Info Not Displaying
- Verify user is authenticated (`useAuth` returns user object)
- Check API call to `/auth/me` succeeds
- Inspect user object structure in React DevTools

### Logout Not Working
- Check `useLogout` hook is imported correctly
- Verify backend `/auth/logout` endpoint is accessible
- Check network tab for logout request

---

**Everything is working! The app shell is ready for content implementation.** 🎉

