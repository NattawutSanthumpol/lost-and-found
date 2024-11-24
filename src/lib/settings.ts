export const ITEM_PER_PAGE = 10;

export const LOGIN = "/login";

// export const ROOT = "/";
export const ROOT_AUTH = "/admin/dashboard"
export const ROOT = "/lostItem";

export const PUBLIC_ROUTES = [
  "/lostItem(.*)",
];

export const PROTECTED_SUB_ROUTES = [
  "/admin/dashboard(.*)",
  "/admin/students(.*)",
  "/admin/teachers(.*)",
  "/admin/itemTypes(.*)",
  "/admin/lostItems",
];

export const PROTECTED_ADMIN_ROUTES = [
  "/admin/users(.*)",
]

export const SUPABASE_IMAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/"
export const BUCKET_NAME = "lostFound"