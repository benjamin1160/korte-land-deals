/**
 * Shape of the pre-approval form's action state.
 *
 * This lives outside `app/actions.ts` on purpose: a `"use server"` module may
 * only export async functions, so the initial-state constant cannot live there.
 */

export const LEAD_FIELDS = [
  "name",
  "phone",
  "email",
  "county",
  "landStatus",
  "budget",
  "notes",
] as const;

export type LeadField = (typeof LEAD_FIELDS)[number];

export type LeadState = {
  status: "idle" | "ok" | "error";
  message: string;
  fieldErrors?: Partial<Record<LeadField, string>>;
  /** Echoed back so a rejected submission does not wipe what was typed. */
  values?: Partial<Record<LeadField, string>>;
};

export const EMPTY_LEAD_STATE: LeadState = { status: "idle", message: "" };
