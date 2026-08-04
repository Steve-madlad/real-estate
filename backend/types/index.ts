export const ALLOWED_ROLES = ["tenant", "manager"] as const;

export type Role = (typeof ALLOWED_ROLES)[number];

export type RoleList = Role[];
