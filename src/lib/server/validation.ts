import { NextResponse } from 'next/server'
import { z } from 'zod'

/* ── Shared field shapes ───────────────────────────────────────────────────
   Bounded on purpose. Every one of these was previously unbounded: a bio, a
   pin note or a trip title could be a megabyte of text and the route would
   store it. Length caps are the cheapest denial-of-service defence there is,
   and they double as the validation the forms should have had. */

const email = z
  .string()
  .trim()
  .min(3)
  .max(254)
  .email('Enter a valid email address.')
  .toLowerCase()

/* 8 is the floor NIST asks for, and there was no floor at all before — signup
   accepted a one-character password. No composition rules (a required symbol,
   a required digit): they push people towards `Password1!` and measurably
   weaken the result. Length is what matters, so the cap is generous.
   72 bytes is not arbitrary — bcrypt silently ignores anything past it, so a
   longer password would give a false sense of strength. */
const password = z
  .string()
  .min(8, 'Use at least 8 characters.')
  .max(72, 'Passwords are limited to 72 characters.')

const shortText = (max: number) => z.string().trim().max(max)

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(80),
  email,
  phone: shortText(32).optional().nullable(),
  password,
  otp: z.string().trim().min(6, 'Enter the 6-digit verification code.').max(6),
})

export const loginSchema = z.object({
  email,
  /* Deliberately not `password` above. Applying the signup rules here would
     turn "your password is too short" into an oracle telling an attacker which
     stored passwords predate the rule. Login only cares that something arrived. */
  password: z.string().min(1, 'Enter your password.').max(200),
})

export const forgotPasswordSchema = z.object({ email })

export const resetWithOtpSchema = z.object({
  email,
  otp: z.string().trim().min(6, 'Enter the 6-digit verification code.').max(6),
  newPassword: password,
})

export const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    phone: shortText(32).nullable(),
    avatar: shortText(300),
    bio: shortText(600),
    travelStyle: z.array(shortText(40)).max(12),
    dreamDestinations: shortText(300),
  })
  /* Partial, because this is a PATCH in a PUT's clothing — the settings page
     sends only the fields it changed, and an absent field must mean "leave it"
     rather than "clear it". The explicit key list is what stops a caller from
     posting `contributionScore` or `email` and having it written. */
  .partial()

const latitude = z.coerce.number().min(-90).max(90)
const longitude = z.coerce.number().min(-180).max(180)

export const pinSchema = z.object({
  lat: latitude,
  lng: longitude,
  country: z.string().trim().min(1, 'Which country?').max(80),
  note: z.string().trim().min(1, 'Add a note.').max(1000),
  emoji: shortText(16).optional(),
  image: shortText(300).optional().nullable(),
  mood: shortText(32).optional(),
  isPublic: z.boolean().optional(),
})

export const tripPlanSchema = z.object({
  title: z.string().trim().min(1, 'Give the trip a name.').max(120),
  destination: z.string().trim().min(1, 'Where to?').max(120),
  startDate: shortText(32).optional().nullable(),
  endDate: shortText(32).optional().nullable(),
  budgetUSD: z.coerce.number().min(0).max(10_000_000).optional(),
  /* `z.any()` rather than `z.unknown()` deliberately: these two columns are
     Prisma `Json` and their shape belongs to the trip planner, not to this
     boundary. What is enforced here is that they are arrays and how long they
     may be — which is the part that protects the database. `unknown[]` would
     not satisfy Prisma's Json input type without a cast, and a cast that says
     "trust me" reads worse than an honest `any`. */
  itineraryDays: z.array(z.any()).max(120).optional(),
  checklist: z.array(z.any()).max(300).optional(),
})

export const reviewSchema = z.object({
  destinationId: z.string().trim().min(1).max(64),
  /* Was `parseFloat(rating)` with no bounds, so a review could be rated 10000
     and skew every average that reads it. */
  rating: z.coerce.number().min(1, 'Rate between 1 and 5.').max(5),
  content: z.string().trim().min(1, 'Write something.').max(4000),
})

export const gemSchema = z.object({
  name: z.string().trim().min(1, 'Name the place.').max(120),
  country: z.string().trim().min(1, 'Which country?').max(80),
  region: shortText(80).optional(),
  description: z.string().trim().min(1, 'Describe it.').max(600),
  fullDescription: shortText(4000).optional(),
  image: shortText(300).optional(),
  type: shortText(32).optional(),
  purposes: z.array(shortText(32)).max(12).optional(),
  costUSD: z.coerce.number().min(0).max(1_000_000).optional(),
  tips: z.array(shortText(300)).max(20).optional(),
  latitude: latitude.optional(),
  longitude: longitude.optional(),
})

/**
 * Reads and validates a JSON body in one step.
 *
 * Returns a discriminated union rather than throwing, so a handler reads as
 * `if (!parsed.ok) return parsed.response` and TypeScript narrows `parsed.data`
 * to the schema's type on the line after. A malformed body — no JSON at all —
 * lands here as a 400 too; it used to throw inside the handler and come back as
 * a 500, which told the caller the server had broken rather than that they had.
 */
export async function parseBody<T extends z.ZodTypeAny>(
  req: Request,
  schema: T,
): Promise<{ ok: true; data: z.infer<T> } | { ok: false; response: NextResponse }> {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Expected a JSON body.' }, { status: 400 }),
    }
  }

  const result = schema.safeParse(raw)
  if (!result.success) {
    /* The first message only. Returning the whole issue list means echoing
       every field name the schema knows about, and the forms show one error at
       a time anyway. */
    const first = result.error.issues[0]
    return {
      ok: false,
      response: NextResponse.json(
        { message: first?.message ?? 'That request was not valid.', field: first?.path.join('.') },
        { status: 400 },
      ),
    }
  }

  return { ok: true, data: result.data }
}
