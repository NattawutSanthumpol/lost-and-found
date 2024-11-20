export const ITEM_PER_PAGE = 10;

export const LOGIN = "/login";

export const ROOT = "/";

export const PUBLIC_ROUTES = [
  "/login",
  "/itemLost"
];

export const PROTECTED_SUB_ROUTES = [
  "/dashboard(.*)",
  "/student(.*)",
  "/teacher(.*)",
  "/lostItems",
];