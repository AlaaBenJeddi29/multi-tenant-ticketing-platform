export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  //Later with backend RESET_PASSWORD: "/reset-password/:token",
  
  // Protected routes
  CATEGORIES: "/categories",
  PRIORITIES: "/priorities",
  ASSETS: "/assets",
  REQUESTERS: "/requesters",
  
  // To be added in later phases:
  // TICKETS: "/tickets",
  // SLAS: "/slas",
  // AUTOMATION: "/automation",
  // USERS: "/users",
  // NOTIFICATIONS: "/notifications",
} as const;