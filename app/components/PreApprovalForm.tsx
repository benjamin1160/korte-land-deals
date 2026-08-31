"use client";

import { useActionState } from "react";
import { requestPreApproval } from "../actions";
import { EMPTY_LEAD_STATE } from "../lib/lead";
import { BY_PRICE, money } from "../lib/areas";
import { SITE } from "../lib/site";

const field =
  "w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-bone placeholder:text-muted/70 focus:border-gold focus:outline-none";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

export default function PreApprovalForm() {
  const [state, action, pending] = useActionState(
    requestPreApproval,
    EMPTY_LEAD_STATE
  );
  const err = state.fieldErrors ?? {};
  const was = state.values ?? {};

  if (state.status === "ok") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gold/10 p-8 text-center">
        <p className="font-display text-3xl text-gold">You&apos;re in the queue.</p>
        <p className="mx-auto mt-3 max-w-md text-bone">{state.message}</p>
        <p className="mt-6 text-sm text-muted">
          Can&apos;t wait? Call{" "}
          <a href={SITE.phoneHref} className="font-semibold text-bone underline">
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <label className={label} htmlFor="name">
          Your name
        </label>
        <input
          id="name"
          name="name"
          className={field}
          placeholder="Jordan Vega"
          autoComplete="name"
          defaultValue={was.name}
          required
          aria-invalid={!!err.name}
        />
        {err.name && <p className="mt-1 text-xs text-flag">{err.name}</p>}
      </div>

      <div>
        <label className={label} htmlFor="phone">
          Mobile number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className={field}
          placeholder="(352) 555-0142"
          autoComplete="tel"
          defaultValue={was.phone}
          required
          aria-invalid={!!err.phone}
        />
        {err.phone && <p className="mt-1 text-xs text-flag">{err.phone}</p>}
      </div>

      <div>
        <label className={label} htmlFor="email">
          Email <span className="font-normal normal-case">(optional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={field}
          placeholder="you@email.com"
          autoComplete="email"
          defaultValue={was.email}
          aria-invalid={!!err.email}
        />
        {err.email && <p className="mt-1 text-xs text-flag">{err.email}</p>}
      </div>

      <div>
        <label className={label} htmlFor="county">
          County you&apos;re looking at
        </label>
        <select id="county" name="county" className={field} defaultValue={was.county ?? ""}>
          <option value="">Not sure yet</option>
          {BY_PRICE.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.county} — from {money(a.startingPayment)}/mo
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label} htmlFor="landStatus">
          Do you have land?
        </label>
        <select
          id="landStatus"
          name="landStatus"
          className={field}
          defaultValue={was.landStatus ?? "looking"}
        >
          <option value="own">I already own it</option>
          <option value="under-contract">Under contract on a parcel</option>
          <option value="found">Found one I like</option>
          <option value="looking">Still looking</option>
          <option value="no-idea">No idea where to start</option>
        </select>
      </div>

      <div>
        <label className={label} htmlFor="monthly-budget">
          Comfortable monthly payment
        </label>
        <input
          id="monthly-budget"
          name="budget"
          className={field}
          placeholder="$1,500"
          inputMode="numeric"
          defaultValue={was.budget}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={label} htmlFor="notes">
          Anything else? <span className="font-normal normal-case">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className={field}
          placeholder="Bedrooms you need, credit concerns, a parcel link — whatever helps."
          defaultValue={was.notes}
        />
      </div>

      {state.status === "error" && (
        <p className="sm:col-span-2 rounded-xl border border-flag/40 bg-flag/10 px-4 py-3 text-sm text-bone">
          {state.message}
        </p>
      )}

      <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-xl bg-flag px-7 py-4 text-base font-bold text-white transition hover:bg-[#ff5548] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Get my pre-approval range"}
        </button>
        <p className="text-xs leading-relaxed text-muted">
          Soft check to start — no hit to your credit. We answer with a real
          number, not a brochure.
        </p>
      </div>
    </form>
  );
}
