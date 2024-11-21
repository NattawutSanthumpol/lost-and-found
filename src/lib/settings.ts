export const ITEM_PER_PAGE = 10;

export const LOGIN = "/login";

export const ROOT = "/";

export const PUBLIC_ROUTES = [
  "/login",
  "/lostItem(.*)",
];

export const PROTECTED_SUB_ROUTES = [
  "/admin/dashboard(.*)",
  "/admin/students(.*)",
  "/admin/teachers(.*)",
  "/admin/itemTypes(.*)",
  "/admin/lostItems",
];