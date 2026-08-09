# MULTI-TENANT TICKETING PLATFORM — FRONTEND ARCHITECTURE REPORT

**Generated:** 2026-08-09  
**Purpose:** Complete reference document for AI assistants working on this codebase

---

## 1. TECH STACK & TOOLING

### 1.1 Core Dependencies (package.json)

#### Production Dependencies
```json
{
  "@fontsource-variable/geist": "^5.3.0",
  "@hookform/resolvers": "^5.4.0",
  "@tailwindcss/vite": "^4.3.3",
  "@tanstack/react-query": "^5.101.4",
  "@tanstack/react-query-devtools": "^5.101.4",
  "axios": "^1.18.1",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^1.26.0",
  "radix-ui": "^1.6.6",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-hook-form": "^7.82.0",
  "react-router-dom": "^7.18.1",
  "shadcn": "^4.14.1",
  "tailwind-merge": "^3.6.0",
  "tailwindcss": "^4.3.3",
  "tw-animate-css": "^1.4.0",
  "zod": "^4.4.3"
}
```

#### Dev Dependencies
```json
{
  "@eslint/js": "^9.36.0",
  "@types/node": "^26.1.1",
  "@types/react": "^19.1.13",
  "@types/react-dom": "^19.1.9",
  "@vitejs/plugin-react": "^5.0.3",
  "eslint": "^9.36.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.20",
  "globals": "^16.4.0",
  "typescript": "~5.8.3",
  "typescript-eslint": "^8.44.0",
  "vite": "^7.1.7"
}
```

### 1.2 Vite Configuration

**File:** `vite.config.ts`
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
 resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
});
```

### 1.3 TypeScript Configuration

**File:** `tsconfig.json`
```jsonc
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**File:** `tsconfig.app.json`
```jsonc
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }, 
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**Path Aliases:** All imports using `@/` resolve to `./src/`

### 1.4 Tailwind CSS Configuration

Tailwind CSS v4 is used via the Vite plugin (`@tailwindcss/vite`). There is **no traditional `tailwind.config.js`** file.

**Configuration Location:** `src/index.css`

The project uses Tailwind v4's new `@theme inline` directive for configuration:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/geist";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-heading: var(--font-sans);
    --font-sans: 'Geist Variable', sans-serif;
    --color-sidebar-ring: var(--sidebar-ring);
    --color-sidebar-border: var(--sidebar-border);
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
    --radius-2xl: calc(var(--radius) * 1.8);
    --radius-3xl: calc(var(--radius) * 2.2);
    --radius-4xl: calc(var(--radius) * 2.6);
}
```

**Design Tokens:**
- Base color: `neutral` (from shadcn config)
- Border radius: `0.625rem` (10px)
- Font: Geist Variable
- Color system: oklch color space
- Dark mode: Class-based (`.dark`)

### 1.5 shadcn/ui Configuration

**File:** `components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {
    "@shadcn-studio": "https://shadcnstudio.com/r/{style}/{name}.json",
    "@ss-components": "https://shadcnstudio.com/r/components/{style}/{name}.json",
    "@ss-blocks": "https://shadcnstudio.com/r/blocks/{style}/{name}.json",
    "@ss-themes": "https://shadcnstudio.com/r/themes/{name}.json"
  }
}
```

**Style:** `radix-nova` (NOT default or new-york)

### 1.6 Installed shadcn/ui Components

Located in `src/components/ui/`:

1. `alert.tsx`
2. `badge.tsx`
3. `button.tsx`
4. `card.tsx`
5. `field.tsx` (custom form field wrapper)
6. `input.tsx`
7. `label.tsx`
8. `separator.tsx`
9. `skeleton.tsx`
10. `table.tsx`

**Additional:** `src/components/shadcn-studio/logo.tsx` (shadcn studio component)

---

## 2. PROJECT STRUCTURE

### 2.1 Full Directory Tree (src/)

```
src/
├── api/
│   ├── client.ts
│   └── queryClient.ts
├── app/
│   ├── layouts/
│   │   ├── ProtectedLayout.tsx
│   │   ├── PublicLayout.tsx
│   │   └── RootLayout.tsx
│   ├── providers/
│   │   ├── AppProviders.tsx
│   │   └── QueryProvider.tsx
│   └── router/
│       ├── AppRouter.tsx
│       └── routes.ts
├── assets/
│   └── svg/
│       ├── auth-background-shape.tsx
│       └── logo.tsx
├── components/
│   ├── common/           (EMPTY)
│   ├── shadcn-studio/
│   │   └── logo.tsx
│   └── ui/
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── field.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── separator.tsx
│       ├── skeleton.tsx
│       └── table.tsx
├── features/
│   ├── auth/
│   │   ├── api/
│   │   │   ├── auth.api.ts
│   │   │   ├── auth.keys.ts
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── BrandPanel.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── RequireAuth.tsx
│   │   │   └── ResetPasswordForm.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useLogin.ts
│   │   ├── pages/
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ResetPasswordPage.tsx
│   │   ├── schemas/
│   │   │   ├── forgot-password.schema.ts
│   │   │   ├── login.schema.ts
│   │   │   ├── register.schema.ts
│   │   │   └── reset-password.schema.ts
│   │   └── types/
│   │       └── auth.types.ts
│   ├── dashboard/
│   │   ├── api/
│   │   │   ├── dashboard.api.ts
│   │   │   └── dashboard.queryKeys.ts
│   │   ├── components/
│   │   │   ├── AgentWorkloadTable.tsx
│   │   │   ├── CategoryDistributionTable.tsx
│   │   │   ├── PriorityDistributionTable.tsx
│   │   │   ├── SlaCard.tsx
│   │   │   ├── StatusDistributionCard.tsx
│   │   │   └── SummaryCards.tsx
│   │   ├── hooks/
│   │   │   └── useDashboardOverview.ts
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   ├── types/
│   │   │   └── dashboard.types.ts
│   │   └── index.ts
│   ├── errors/
│   │   └── pages/
│   │       └── NotFoundPage.tsx
│   └── home/
│       └── pages/
│           └── HomePage.tsx
├── hooks/               (EMPTY)
├── lib/
│   ├── react-query.ts
│   └── utils.ts
├── styles/              (EMPTY)
├── types/               (EMPTY)
├── utils/               (EMPTY)
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

### 2.2 Feature-Based Folder Convention

**Expected Structure per Feature:**
```
features/<feature-name>/
├── api/           # API calls and query key factories
├── components/    # Feature-specific components
├── context/       # React context providers (if needed)
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── schemas/       # Zod validation schemas
└── types/         # TypeScript type definitions
```

**Compliance Analysis:**

| Feature      | api/ | components/ | context/ | hooks/ | pages/ | schemas/ | types/ | Notes |
|--------------|------|-------------|----------|--------|--------|----------|--------|-------|
| **auth**     | ✅   | ✅          | ✅       | ✅     | ✅     | ✅       | ✅     | **FULLY COMPLIANT** |
| **dashboard**| ✅   | ✅          | ❌       | ✅     | ✅     | ❌       | ✅     | No schemas, no context |
| **errors**   | ❌   | ❌          | ❌       | ❌     | ✅     | ❌       | ❌     | Only pages/ (simple feature) |
| **home**     | ❌   | ❌          | ❌       | ❌     | ✅     | ❌       | ❌     | Only pages/ (simple feature) |

**Observation:** Only `auth` follows the complete pattern. `dashboard`, `errors`, and `home` are simplified based on their needs.

---

## 3. ROUTING — FULL DETAIL

### 3.1 Route Constants

**File:** `src/app/router/routes.ts`
```typescript
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  //Later with backend RESET_PASSWORD: "/reset-password/:token",
} as const;
```

### 3.2 Complete AppRouter

**File:** `src/app/router/AppRouter.tsx`
```typescript
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";

import RequireAuth from "@/features/auth/components/RequireAuth";

import HomePage from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import NotFoundPage from "@/features/errors/pages/NotFoundPage";

import { ROUTES } from "./routes";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: ROUTES.HOME, element: <HomePage /> },
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.REGISTER, element: <RegisterPage /> },
          { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
          { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <ProtectedLayout />,
            children: [{ path: ROUTES.DASHBOARD, element: <DashboardPage /> }],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
```

### 3.3 Route Breakdown

| Path                 | Component            | Layout            | Guard         | Description |
|----------------------|----------------------|-------------------|---------------|-------------|
| `/`                  | HomePage             | PublicLayout      | None          | Landing page |
| `/login`             | LoginPage            | PublicLayout      | None          | User login |
| `/register`          | RegisterPage         | PublicLayout      | None          | User registration |
| `/forgot-password`   | ForgotPasswordPage   | PublicLayout      | None          | Password recovery |
| `/reset-password`    | ResetPasswordPage    | PublicLayout      | None          | Password reset (will be `/reset-password/:token`) |
| `/dashboard`         | DashboardPage        | ProtectedLayout   | RequireAuth   | Main dashboard |
| `*` (catch-all)      | NotFoundPage         | None (direct)     | None          | 404 page |

### 3.4 Layout Components

#### RootLayout.tsx
```typescript
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Outlet />
    </main>
  );
}
```
**Purpose:** Top-level wrapper with base background color

#### PublicLayout.tsx
```typescript
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Outlet />
    </div>
  );
}
```
**Purpose:** Centers content for auth pages

#### ProtectedLayout.tsx
```typescript
// ProtectedLayout.tsx
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
```
**Purpose:** Wrapper for authenticated routes (no nav/sidebar yet)

### 3.5 Route Guard Components

#### RequireAuth.tsx
```typescript
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve where they were headed so login can redirect back after success.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
```
**Used in:** AppRouter as wrapper for protected routes  
**Logic:** Redirects to `/login` if not authenticated, preserving intended destination

#### ProtectedRoute.tsx
```typescript
import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/app/router/routes";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
```
**Status:** ❌ **UNUSED** — `RequireAuth` is used instead  
**Difference:** Doesn't preserve location state

---

## 4. AUTH STATE — FULL DETAIL

### 4.1 AuthContext (Complete)

**File:** `src/features/auth/context/AuthContext.tsx`
```typescript
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "../types/auth.types";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;

  login: (token: string, user: AuthUser) => void;
  logout: () => void;

  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  function login(token: string, user: AuthUser) {
    setToken(token);
    setUser(user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
```

### 4.2 Auth Types (Complete)

**File:** `src/features/auth/types/auth.types.ts`
```typescript
export type UserRole =
  | "SUPER_ADMIN"
  | "ORG_ADMIN"
  | "AGENT";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
```

### 4.3 Auth API (Complete)

**File:** `src/features/auth/api/auth.api.ts`
```typescript
import { api } from "@/api/client";

import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  AuthResponse,
} from "../types/auth.types";

export async function login(data: LoginRequest) {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data
  );

  return response.data;
}

export const register = async (
  data: RegisterRequest
) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordRequest
) => {
  const response = await api.post(
    "/auth/forgot-password",
    data
  );

  return response.data;
};

export const verifyResetCode = async (
  data: VerifyResetCodeRequest
) => {
  const response = await api.post(
    "/auth/verify-reset-code",
    data
  );

  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest
) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  );

  return response.data;
};
```

### 4.4 Session Persistence

**🔴 CRITICAL ISSUE: NO SESSION PERSISTENCE**

**What happens on page refresh:**
1. AuthContext state (`user`, `token`) is reset to `null` (useState initial value)
2. User is logged out and redirected to `/login`
3. No attempt to rehydrate from localStorage, sessionStorage, or cookies

**Current Storage Method:**
- ❌ No localStorage
- ❌ No sessionStorage
- ❌ No cookies
- ✅ Only in-memory React state (lost on refresh)

**What's Missing:**
- Persist `accessToken` and `user` to localStorage on login
- Rehydrate AuthContext from localStorage on app mount
- Token refresh mechanism

### 4.5 Token Storage & Transmission

**File:** `src/api/client.ts`
```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});
```

**Current State:**
- ❌ No `withCredentials: true` (cookies not sent)
- ❌ No Authorization header interceptor
- ❌ No token attached to requests
- ❌ No refresh token logic
- ❌ No 401 response interceptor

**How tokens are currently sent:** **THEY ARE NOT**

The `token` exists in AuthContext but is never attached to API requests. Protected endpoints will fail.

**What's needed:**
```typescript
// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = // get from localStorage or context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);
```

### 4.6 Duplicate API File Issue

**🟡 CODE SMELL:** `auth.keys.ts` is a complete duplicate of `auth.api.ts`

**File:** `src/features/auth/api/auth.keys.ts`
```typescript
import { api } from "@/api/client";

import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  AuthResponse,
} from "../types/auth.types";

export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (
  data: RegisterRequest
) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordRequest
) => {
  const response = await api.post(
    "/auth/forgot-password",
    data
  );

  return response.data;
};

export const verifyResetCode = async (
  data: VerifyResetCodeRequest
) => {
  const response = await api.post(
    "/auth/verify-reset-code",
    data
  );

  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest
) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  );

  return response.data;
};
```

**Recommendation:** Delete `auth.keys.ts`. It should contain query key factories, not API functions.

**Expected pattern:**
```typescript
// auth.keys.ts should be:
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};
```

---

## 5. SERVER STATE — TANSTACK QUERY SETUP

### 5.1 QueryClient Configuration

**File:** `src/api/queryClient.ts`
```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

**File:** `src/lib/react-query.ts` (DUPLICATE)
```typescript
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});
```

**🟡 ISSUE:** Two separate QueryClient instances exist with different configs

| Location | Used By | staleTime | mutations.retry |
|----------|---------|-----------|-----------------|
| `api/queryClient.ts` | `QueryProvider.tsx` (unused) | default (0) | 1 |
| `lib/react-query.ts` | `AppProviders.tsx` (active) | 60s | not set |

**Active config:** `lib/react-query.ts` is the one actually used in the app

### 5.2 QueryClientProvider Setup

**File:** `src/app/providers/QueryProvider.tsx` (UNUSED)
```typescript
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/api/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {
  children: React.ReactNode;
};

export default function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**File:** `src/app/providers/AppProviders.tsx` (ACTIVE)
```typescript
import type { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query";

import { AuthProvider } from "@/features/auth/context/AuthContext";

type Props = {
  children: ReactNode;
};

export default function AppProviders({
  children,
}: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

**Provider Chain:**
```
main.tsx
  └─ AppProviders
       ├─ QueryClientProvider (from lib/react-query.ts)
       │    └─ AuthProvider
       │         └─ App
       │              └─ AppRouter
```

**🟡 ISSUE:** `QueryProvider.tsx` includes ReactQueryDevtools but is unused. Devtools not available.

### 5.3 Features with TanStack Query

| Feature    | Has api/ | Has hooks/ | Query Keys Pattern | Status |
|------------|----------|------------|-------------------|--------|
| auth       | ✅       | ✅         | ❌ None (only mutations) | Mutations only |
| dashboard  | ✅       | ✅         | ✅ `dashboardKeys` | ✅ Complete |

### 5.4 Dashboard Query Keys Pattern

**File:** `src/features/dashboard/api/dashboard.queryKeys.ts`
```typescript
// Keyed by tenantId so a cached response can never leak across
// organizations if the auth context ever changes mid-session.
export const dashboardKeys = {
  all: (tenantId: string) => ["dashboard", tenantId] as const,
  overview: (tenantId: string) =>
    [...dashboardKeys.all(tenantId), "overview"] as const,
};
```

**Pattern:** Hierarchical keys with tenant isolation
- `["dashboard", tenantId]` → all dashboard data for tenant
- `["dashboard", tenantId, "overview"]` → overview endpoint

**Usage Example:** `src/features/dashboard/hooks/useDashboardOverview.ts`
```typescript
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/context/AuthContext";

import { getDashboardOverview } from "../api/dashboard.api";
import { dashboardKeys } from "../api/dashboard.queryKeys";

export function useDashboardOverview() {
  const { user } = useAuth();
  const tenantId = user?.tenantId;

  return useQuery({
    queryKey: dashboardKeys.overview(tenantId ?? "unknown"),
    queryFn: getDashboardOverview,
    enabled: Boolean(tenantId),
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}
```

**Auth Query Pattern (Mutations Only):**

**File:** `src/features/auth/hooks/useLogin.ts`
```typescript
import { useMutation } from "@tanstack/react-query";

import { login as loginRequest } from "../api/auth.api";

import { useAuth } from "../context/AuthContext";

export function useLogin() {
  const auth = useAuth();

  return useMutation({
    mutationFn: loginRequest,

    onSuccess: (response) => {
      auth.login(response.accessToken, response.user);

      console.log("User logged in");
    },

    onError: (error) => {
      console.error(error);
    },
  });
}
```

**No query keys for auth** — all operations are mutations (login, register, etc.)

---

## 6. UI CONVENTIONS

### 6.1 Form Handling Pattern

**Stack:** react-hook-form + zod + @hookform/resolvers

**Example Schema:** `src/features/auth/schemas/login.schema.ts`
```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

**Example Complex Schema:** `src/features/auth/schemas/register.schema.ts`
```typescript
import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name is too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
```

**Usage in Component:** (Abbreviated from `LoginForm.tsx`)
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login.schema";
import { useLogin } from "../hooks/useLogin";

export function LoginForm() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="email"
        type="email"
        {...register("email")}
        aria-invalid={!!errors.email}
      />
      <FieldError
        errors={errors.email ? [{ message: errors.email.message }] : []}
      />
      {/* ... */}
    </form>
  );
}
```

**Pattern:**
1. Define zod schema in `schemas/` folder
2. Export inferred type from schema
3. Use `useForm` with `zodResolver`
4. Use `{...register("fieldName")}` on inputs
5. Display errors via custom `FieldError` component

### 6.2 Shared Components

**Location:** `src/components/common/`

**Status:** ❌ **EMPTY** — No shared components exist yet

### 6.3 shadcn/ui Style

**Configuration:**
- **Style:** `radix-nova` (modern variant)
- **NOT** `default` or `new-york`
- **Base Color:** `neutral`
- **CSS Variables:** Enabled (uses oklch color space)
- **Icon Library:** lucide-react
- **Prefix:** None

### 6.4 Utility Functions

**File:** `src/lib/utils.ts`
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Purpose:** Merge Tailwind classes intelligently (standard shadcn pattern)

---

## 7. ENVIRONMENT

### 7.1 Environment Variables

**File:** `.env`
```
VITE_API_URL=http://localhost:5000/api
```

**Status:** ❌ No `.env.example` file exists

**Expected Variables:**
```
VITE_API_URL=http://localhost:5000/api
```

### 7.2 Local Development API URL

**Value:** `http://localhost:5000/api`


**Used in:** `src/api/client.ts` via `import.meta.env.VITE_API_URL`

---

## 8. CURRENT STATE OF FEATURES

### 8.1 Auth Feature

**Status:** 🟡 **MOSTLY COMPLETE** — Missing persistence

**Implemented:**
- ✅ Login page + form + validation
- ✅ Register page + form + validation
- ✅ Forgot password page + form
- ✅ Reset password page + form
- ✅ AuthContext with login/logout
- ✅ Route guards (RequireAuth)
- ✅ API functions for all endpoints
- ✅ TanStack Query mutations (useLogin)
- ✅ Zod schemas for all forms

**Missing/Issues:**
- ❌ Session persistence (localStorage/sessionStorage)
- ❌ Token attached to API requests (no interceptor)
- ❌ Token refresh mechanism
- ❌ Axios interceptor for 401 handling
- ❌ useRegister, useForgotPassword hooks (only useLogin exists)
- 🟡 Duplicate file: `auth.keys.ts` vs `auth.api.ts`
- 🟡 GitHub OAuth button (not connected)

### 8.2 Dashboard Feature

**Status:** ✅ **FULLY IMPLEMENTED**

**Implemented:**
- ✅ Dashboard page with data fetching
- ✅ API endpoint (`getDashboardOverview`)
- ✅ Query keys with tenant isolation
- ✅ Custom hook (`useDashboardOverview`)
- ✅ TypeScript types for all data structures
- ✅ Component breakdown:
  - `SummaryCards` — ticket count cards
  - `SlaCard` — SLA breach metrics
  - `StatusDistributionCard` — status breakdown
  - `PriorityDistributionTable` — priority stats
  - `CategoryDistributionTable` — category stats
  - `AgentWorkloadTable` — agent assignment counts
- ✅ Loading states (Skeleton)
- ✅ Error handling
- ✅ Auto-refetch (60s interval)

**Data Types:**
```typescript
export interface DashboardOverview {
  summary: DashboardSummary;
  sla: DashboardSla;
  statusDistribution: DashboardStatusDistributionItem[];
  priorityDistribution: DashboardPriorityDistributionItem[];
  categoryDistribution: DashboardCategoryDistributionItem[];
  agentWorkload: DashboardAgentWorkloadItem[];
}
```

### 8.3 Home Feature


**Status:** 🟡 **PLACEHOLDER/DEBUG**

**Implementation:**
```typescript
export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Home</h1>
      <p className="mt-5">
        Authenticated: {isAuthenticated ? "Yes" : "No"}
      </p>
      <pre className="mt-6 rounded bg-black p-5 text-green-400">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
```

**Purpose:** Debug page showing auth state  
**Note:** Not a production landing page

### 8.4 Errors Feature

**Status:** ✅ **MINIMAL BUT COMPLETE**

**Implementation:**
```typescript
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-5xl font-bold">404</h1>
    </div>
  );
}
```

**Purpose:** 404 catch-all route  
**Improvement Needed:** Add navigation back to home/dashboard

---

## 9. OPEN GAPS / TODOs

### 9.1 Critical Issues

#### 🔴 No Session Persistence
**Impact:** Users logged out on every page refresh  
**Location:** `src/features/auth/context/AuthContext.tsx`  
**Fix Required:**
- Store `accessToken` and `user` in localStorage on login
- Read from localStorage in AuthProvider initialization (useEffect)
- Clear localStorage on logout

#### 🔴 Tokens Not Sent to Backend
**Impact:** All protected API calls will fail with 401  
**Location:** `src/api/client.ts`  
**Fix Required:**
- Add axios request interceptor to attach `Authorization: Bearer ${token}` header
- Get token from localStorage or AuthContext

- Add axios response interceptor for 401 handling

### 9.2 Code Quality Issues

#### 🟡 Duplicate QueryClient Configuration
**Files:**
- `src/api/queryClient.ts` (unused)
- `src/lib/react-query.ts` (active)

**Fix:** Delete `src/api/queryClient.ts` or consolidate

#### 🟡 Duplicate auth.keys.ts File
**Issue:** `src/features/auth/api/auth.keys.ts` duplicates `auth.api.ts`  
**Expected:** Query key factories, not API functions  
**Fix:** Delete or repurpose for query keys

#### 🟡 Unused ProtectedRoute Component
**File:** `src/features/auth/components/ProtectedRoute.tsx`  
**Used:** ❌ No — `RequireAuth.tsx` is used instead  
**Fix:** Delete or consolidate

#### 🟡 Unused QueryProvider Component
**File:** `src/app/providers/QueryProvider.tsx`  
**Issue:** Includes ReactQueryDevtools but never used  
**Used By:** Nothing (AppProviders imports from lib/react-query directly)  
**Fix:** Use this provider instead of duplicating in AppProviders, or delete

### 9.3 Missing Features

#### Token Refresh
- ❌ No refresh token logic
- ❌ No automatic token renewal
- `AuthResponse` includes `refreshToken` but it's unused

#### Additional Auth Hooks
- ✅ `useLogin` exists
- ❌ `useRegister` missing
- ❌ `useForgotPassword` missing
- ❌ `useResetPassword` missing
- ❌ `useLogout` missing (could be useful for API call on logout)

#### Protected Dashboard Access
- Dashboard requires authentication (RequireAuth guard)
- But no token sent → Backend will reject request → Infinite loading or error

#### Error Boundary
- No React error boundary implemented
- Uncaught errors will crash the app

### 9.4 Empty Directories

These exist but have no files:
- `src/components/common/`
- `src/hooks/`
- `src/styles/`
- `src/types/`
- `src/utils/`

**Decision Needed:** Keep for future use or remove?

### 9.5 Naming Inconsistencies


| Feature | Query Keys File Name | Pattern |
|---------|---------------------|---------|
| dashboard | `dashboard.queryKeys.ts` | ✅ Consistent |
| auth | `auth.keys.ts` | 🟡 Should be `auth.queryKeys.ts` |

### 9.6 Route Configuration

**Issue:** `RESET_PASSWORD` route hardcoded without token parameter  
**Current:** `/reset-password`  
**Comment in code:** `//Later with backend RESET_PASSWORD: "/reset-password/:token",`  
**Fix Required:** Update route to accept token param when backend ready

---

## 10. RECOMMENDED NEXT STEPS

### Phase 1: Critical Fixes (Must Do)
1. **Add session persistence to AuthContext**
   - Save to localStorage on login
   - Restore on mount
   - Clear on logout

2. **Add axios interceptor for Authorization header**
   - Request interceptor to attach token
   - Response interceptor for 401 handling

3. **Test dashboard access with real backend**
   - Ensure token is sent
   - Handle loading/error states

### Phase 2: Code Quality (Should Do)
1. Delete duplicate files:
   - `auth.keys.ts` (or repurpose)
   - `ProtectedRoute.tsx`
   - One of the QueryClient configs

2. Rename `auth.keys.ts` → `auth.queryKeys.ts` (if kept)

3. Add missing auth hooks:
   - `useRegister`
   - `useForgotPassword`
   - `useResetPassword`

4. Consolidate QueryClient setup:
   - Use `QueryProvider.tsx` with devtools
   - Remove duplicate from AppProviders

### Phase 3: Features (Nice to Have)
1. Implement token refresh mechanism
2. Add React error boundary
3. Improve 404 page with navigation
4. Replace HomePage with real landing page
5. Add shared components to `components/common/`
6. Create `.env.example` file

---

## 11. FILE REFERENCE INDEX

### Entry Points
- `src/main.tsx` → Root render
- `src/App.tsx` → Router wrapper
- `src/index.css` → Global styles + Tailwind

### Core Configuration
- `vite.config.ts` → Build config + path aliases
- `tsconfig.json`, `tsconfig.app.json` → TypeScript config
- `components.json` → shadcn/ui config
- `.env` → Environment variables

### App Structure
- `src/app/router/AppRouter.tsx` → Route definitions
- `src/app/router/routes.ts` → Route constants
- `src/app/layouts/` → Layout wrappers
- `src/app/providers/AppProviders.tsx` → Context providers

### API Layer
- `src/api/client.ts` → Axios instance
- `src/api/queryClient.ts` → TanStack Query (unused)
- `src/lib/react-query.ts` → TanStack Query (active)

### Auth Feature
- `src/features/auth/context/AuthContext.tsx` → Auth state
- `src/features/auth/api/auth.api.ts` → API functions
- `src/features/auth/types/auth.types.ts` → TypeScript types
- `src/features/auth/schemas/*.schema.ts` → Zod validation
- `src/features/auth/hooks/useLogin.ts` → Mutation hook
- `src/features/auth/components/RequireAuth.tsx` → Route guard

### Dashboard Feature
- `src/features/dashboard/hooks/useDashboardOverview.ts` → Query hook
- `src/features/dashboard/api/dashboard.api.ts` → API functions
- `src/features/dashboard/api/dashboard.queryKeys.ts` → Query keys
- `src/features/dashboard/types/dashboard.types.ts` → TypeScript types
- `src/features/dashboard/pages/DashboardPage.tsx` → Main page

### UI Components
- `src/components/ui/*.tsx` → shadcn/ui components
- `src/lib/utils.ts` → `cn()` utility

---

## 12. ARCHITECTURE DECISIONS

### State Management Strategy
- **Auth State:** React Context (`AuthContext`)
- **Server State:** TanStack Query
- **Form State:** react-hook-form
- **No global state management** (Redux/Zustand not needed)

### Styling Strategy
- **Tailwind CSS v4** via Vite plugin
- **shadcn/ui** for component library (radix-nova style)
- **No CSS modules or styled-components**
- **Utility-first** approach

### Routing Strategy
- **React Router v7** (createBrowserRouter)
- **Nested layouts** (RootLayout → PublicLayout/ProtectedLayout)
- **Route guards** via RequireAuth wrapper component

### API Strategy
- **Axios** for HTTP client
- **Feature-based API files** (not centralized services)
- **TanStack Query** for caching and state

### Type Safety
- **TypeScript strict mode** enabled
- **Zod** for runtime validation + type inference
- **No `any` types** (enforced by tsconfig)

### Component Strategy
- **Functional components** only (no class components)
- **Custom hooks** for logic reuse
- **Feature-based organization** (not by component type)

---

## 13. ANTI-PATTERNS TO AVOID

### ❌ Don't Do This

1. **Don't create services folder**
   - Keep API calls in feature folders (`features/*/api/`)

2. **Don't add Redux/MobX/Zustand**
   - React Context + TanStack Query is sufficient

3. **Don't use CSS modules**
   - Stick with Tailwind utility classes

4. **Don't bypass route guards**
   - Always wrap protected routes with RequireAuth

5. **Don't store sensitive data in localStorage without encryption**
   - Consider HttpOnly cookies for tokens (requires backend support)

6. **Don't create global utils folder**
   - Put utilities in feature folders or `lib/`

7. **Don't ignore TypeScript errors**
   - Fix them, don't use `@ts-ignore`

---

## 14. CONVENTIONS SUMMARY

### File Naming
- **Components:** PascalCase (e.g., `LoginForm.tsx`)
- **Hooks:** camelCase starting with `use` (e.g., `useLogin.ts`)
- **Types:** PascalCase with `.types.ts` suffix
- **Schemas:** kebab-case with `.schema.ts` suffix
- **API files:** kebab-case with `.api.ts` suffix
- **Query keys:** kebab-case with `.queryKeys.ts` suffix

### Import Order (Not enforced, but observed)
1. External libraries (React, etc.)
2. Internal modules (components, hooks)
3. Types
4. Styles

### Function Declaration Style
- **Components:** `export default function ComponentName()`
- **Hooks:** `export function useHookName()`
- **Utilities:** `export function utilityName()`

---

## 15. MISSING DOCUMENTATION

What's not in this codebase yet:
- No README.md with setup instructions
- No component documentation/Storybook
- No E2E tests
- No unit tests
- No API documentation/OpenAPI spec reference
- No deployment configuration (Dockerfile, nginx.conf, etc.)
- No CI/CD pipeline

---

## APPENDIX A: Complete auth.api.ts

```typescript
import { api } from "@/api/client";

import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  AuthResponse,
} from "../types/auth.types";

export async function login(data: LoginRequest) {
  const response = await api.post<AuthResponse>(
    "/auth/login",
    data
  );

  return response.data;
}

export const register = async (
  data: RegisterRequest
) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordRequest
) => {
  const response = await api.post(
    "/auth/forgot-password",
    data
  );

  return response.data;
};

export const verifyResetCode = async (
  data: VerifyResetCodeRequest
) => {
  const response = await api.post(
    "/auth/verify-reset-code",
    data
  );

  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest
) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  );

  return response.data;
};
```

---

## APPENDIX B: Complete LoginForm.tsx (Example Form Component)

```typescript
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { ROUTES } from "@/app/router/routes";

import {
  loginSchema,
  type LoginFormData,
} from "@/features/auth/schemas/login.schema";

import { useLogin } from "@/features/auth/hooks/useLogin";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6 w-full", className)}
      {...props}
    >
      <FieldGroup>
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to your workspace.
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">
            Email
          </FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            autoComplete="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />

          <FieldError
            errors={
              errors.email
                ? [{ message: errors.email.message }]
                : []
            }
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">
              Password
            </FieldLabel>

            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />

          <FieldError
            errors={
              errors.password
                ? [{ message: errors.password.message }]
                : []
            }
          />
        </Field>

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending
            ? "Signing in..."
            : "Sign in"}
        </Button>

        <FieldSeparator>
          Or continue with
        </FieldSeparator>

        <Button
          variant="outline"
          type="button"
          className="w-full"
        >
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 .297c-6.63 0-12 5.373-12 12
              0 5.303 3.438 9.8 8.205 11.385
              .6.113.82-.258.82-.577
              0-.285-.01-1.04-.015-2.04
              -3.338.724-4.042-1.61-4.042-1.61
              -.546-1.385-1.335-1.755-1.335-1.755
              -1.087-.744.084-.729.084-.729
              1.205.084 1.838 1.236 1.838 1.236
              1.07 1.835 2.809 1.305 3.495.998
              .108-.776.417-1.305.76-1.605
              -2.665-.3-5.466-1.332-5.466-5.93
              0-1.31.465-2.38 1.235-3.22
              -.135-.303-.54-1.523.105-3.176
              0 0 1.005-.322 3.3 1.23
              .96-.267 1.98-.399 3-.405
              1.02.006 2.04.138 3 .405
              2.28-1.552 3.285-1.23 3.285-1.23
              .645 1.653.24 2.873.12 3.176
              .765.84 1.23 1.91 1.23 3.22
              0 4.61-2.805 5.625-5.475 5.92
              .42.36.81 1.096.81 2.22
              0 1.606-.015 2.896-.015 3.286
              0 .315.21.69.825.57
              C20.565 22.092 24 17.592 24 12.297
              c0-6.627-5.373-12-12-12"
            />
          </svg>

          Continue with GitHub
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Create one
          </Link>
        </p>

        {loginMutation.isError && (
          <p className="text-center text-sm text-red-500">
            Invalid email or password.
          </p>
        )}
      </FieldGroup>
    </form>
  );
}
```

---

## APPENDIX C: Provider Chain Visualization

```
main.tsx
  └─ <React.StrictMode>
       └─ <AppProviders>
            ├─ <QueryClientProvider client={queryClient from lib/react-query}>
            │    └─ <AuthProvider>
            │         └─ {children}
            │              └─ <App>
            │                   └─ <AppRouter>
            │                        └─ <RouterProvider router={router}>
            │                             └─ <RootLayout>
            │                                  ├─ <PublicLayout>
            │                                  │    ├─ HomePage (/)
            │                                  │    ├─ LoginPage (/login)
            │                                  │    ├─ RegisterPage (/register)
            │                                  │    ├─ ForgotPasswordPage (/forgot-password)
            │                                  │    └─ ResetPasswordPage (/reset-password)
            │                                  │
            │                                  ├─ <RequireAuth>
            │                                  │    └─ <ProtectedLayout>
            │                                  │         └─ DashboardPage (/dashboard)
            │                                  │
            │                                  └─ NotFoundPage (*)
```

---

## APPENDIX D: Quick Command Reference

### Development
```bash
npm run dev          # Start dev server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Dependencies
```bash
# Add new shadcn component
npx shadcn@latest add [component-name]

# Install dependencies
npm install
```

---

## APPENDIX E: Critical Code Snippets to Fix Issues

### Fix 1: Add Session Persistence to AuthContext

Replace `AuthContext.tsx` with:

```typescript
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type { AuthUser } from "../types/auth.types";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: ReactNode;
};

const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to restore session:", error);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }

    setIsInitialized(true);
  }, []);

  function login(token: string, user: AuthUser) {
    setToken(token);
    setUser(user);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Don't render children until we've tried to restore session
  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
```

### Fix 2: Add Axios Interceptor for Authorization Header

Replace `src/api/client.ts` with:

```typescript
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### Fix 3: Consolidate QueryClient Configuration

Delete `src/api/queryClient.ts` and update `src/app/providers/AppProviders.tsx`:

```typescript
import type { ReactNode } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/lib/react-query";
import { AuthProvider } from "@/features/auth/context/AuthContext";

type Props = {
  children: ReactNode;
};

export default function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

## FINAL NOTES FOR AI ASSISTANTS

### When Working on This Codebase:

1. **Always check AuthContext state** before implementing protected features
2. **Use the feature folder structure** — don't create top-level services/
3. **Follow the established patterns:**
   - API functions in `features/*/api/*.api.ts`
   - Query keys in `features/*/api/*.queryKeys.ts`
   - Hooks in `features/*/hooks/use*.ts`
   - Schemas in `features/*/schemas/*.schema.ts`
   - Types in `features/*/types/*.types.ts`
4. **Use shadcn/ui components** — don't create custom button/input from scratch
5. **Use TanStack Query** for server state — don't use useState for API data
6. **Use react-hook-form + zod** for forms — don't manually manage form state
7. **Import with @ alias** — use `@/` not relative paths for src/ imports

### Known Working Patterns:

✅ `dashboard` feature shows the complete pattern  
✅ `auth` forms show react-hook-form + zod usage  
✅ `useDashboardOverview` shows query hook pattern  
✅ `dashboardKeys` shows query key factory pattern

### Known Broken Patterns:

❌ Session persistence (see Fix 1 above)  
❌ Token transmission (see Fix 2 above)  
❌ `auth.keys.ts` file (should be deleted or repurposed)

---

**END OF ARCHITECTURE REPORT**

*This document was generated on 2026-08-09 by analyzing the complete codebase. All file contents, routes, and configurations are verbatim from the current state.*
