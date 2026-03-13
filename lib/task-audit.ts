export const GUEST_AUDIT = {
  createdByName: "Guest",
  createdById: "guest",
  updatedByName: "Guest",
  updatedById: "guest",
} as const

export const GUEST_UPDATED_AUDIT = {
  updatedByName: "Guest",
  updatedById: "guest",
} as const

export function withGuestAudit<T extends Record<string, unknown>>(task: T): T {
  return {
    ...task,
    ...GUEST_AUDIT,
  }
}
