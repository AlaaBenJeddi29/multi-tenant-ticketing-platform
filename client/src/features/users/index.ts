// Types
export type {
  User,
  UserRole,
  CreateUserInput,
  UpdateUserInput,
  UserListParams,
  UsersResponse,
} from "./types/user.types";

// API
export * from "./api/user.api";
export { userKeys } from "./api/user.queryKeys";

// Hooks
export { useUsersList } from "./hooks/useUsersList";
export { useUser } from "./hooks/useUser";
export { useCreateUser } from "./hooks/useCreateUser";
export { useUpdateUser } from "./hooks/useUpdateUser";
export { useActivateUser } from "./hooks/useActivateUser";
export { useDeactivateUser } from "./hooks/useDeactivateUser";
export { useDeleteUser } from "./hooks/useDeleteUser";

// Components
export { UsersTable } from "./components/UsersTable";
export { CreateUserDialog } from "./components/CreateUserDialog";
export { EditUserDialog } from "./components/EditUserDialog";

// Schemas
export { createUserSchema, updateUserSchema } from "./schemas/user.schema";
export type { CreateUserFormData, UpdateUserFormData } from "./schemas/user.schema";

// Pages
export { default as UsersPage } from "./pages/UsersPage";
