export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  SLAS: "/slas",
  //Later with backend RESET_PASSWORD: "/reset-password/:token",
  
  // Protected routes
  CATEGORIES: "/categories",
  PRIORITIES: "/priorities",
  ASSETS: "/assets",
  REQUESTERS: "/requesters",
  TICKETS: "/tickets",
  TICKET_NEW: "/tickets/new",
  TICKET_DETAIL: "/tickets/:id",
  AUTOMATION: "/automation",
  USERS: "/users",
  NOTIFICATIONS: "/notifications",
} as const;