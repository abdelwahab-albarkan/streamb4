/**
 * slugUtils — single source of truth for slug generation.
 *
 * Rules (enforced here AND in all API routes / page components):
 *  1. Input must be the article TITLE only — never the body / content.
 *  2. Lowercase only.
 *  3. Accented characters normalised to ASCII (é→e, ñ→n, …).
 *  4. All non-alphanumeric characters → single hyphen.
 *  5. Collapse multiple consecutive hyphens → one.
 *  6. Trim leading / trailing hyphens.
 *  7. Truncate at the nearest complete word boundary ≤ maxLen (default 80).
 */

// ─── Core generator ───────────────────────────────────────────────────────────

/**
 * Convert any string into a valid URL slug.
 *
 * @param input  — article TITLE. Never pass the body/content.
 * @param maxLen — hard cap (default 80 chars). Truncates at the last hyphen
 *                 before the cap so we never cut mid-word.
 */
export function generateSlug(input: string, maxLen = 80): string {
  if (!input || typeof input !== "string") return "";

  const slug = input
    // 1. Unicode normalise → decompose accents, then strip combining marks
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    // 2. Lowercase
    .toLowerCase()
    // 3. Replace every non-alphanumeric run with a single hyphen
    .replace(/[^a-z0-9]+/g, "-")
    // 4. Collapse multiple hyphens (belt-and-suspenders after step 3)
    .replace(/-{2,}/g, "-")
    // 5. Trim edge hyphens
    .replace(/^-+|-+$/g, "");

  if (slug.length <= maxLen) return slug;

  // Truncate at the last word boundary before the cap
  const cut = slug.slice(0, maxLen);
  const lastHyphen = cut.lastIndexOf("-");
  return lastHyphen > 30 ? cut.slice(0, lastHyphen) : cut; // 30 = min meaningful length
}

// ─── Uniqueness helper ────────────────────────────────────────────────────────

/**
 * Ensure `base` doesn't collide with any existing slug.
 * Appends -2, -3, … until the result is unique.
 *
 * @param base          — already-sanitised slug (output of generateSlug)
 * @param existingSlugs — slugs already in the database (from a query)
 * @param currentId     — skip the post being edited so it doesn't conflict
 *                        with itself.
 */
export function ensureUniqueSlug(
  base: string,
  existingSlugs: string[],
  currentId?: string,
): string {
  const others = currentId
    ? existingSlugs.filter((s) => s !== base || s !== currentId)
    : existingSlugs;

  if (!others.includes(base)) return base;

  let counter = 2;
  while (others.includes(`${base}-${counter}`)) counter++;
  return `${base}-${counter}`;
}

// ─── Validator ────────────────────────────────────────────────────────────────

/**
 * Return true if `slug` is already in valid form (so we can skip regeneration).
 *
 * A valid slug:
 *  - is non-empty
 *  - contains only [a-z0-9-]
 *  - does not start or end with a hyphen
 *  - has no consecutive hyphens
 *  - is at most 80 characters
 */
export function isValidSlug(slug: string, maxLen = 80): boolean {
  if (!slug || typeof slug !== "string") return false;
  if (slug.length > maxLen) return false;
  if (/[^a-z0-9-]/.test(slug)) return false;
  if (slug.startsWith("-") || slug.endsWith("-")) return false;
  if (/--/.test(slug)) return false;
  return true;
}

// ─── Repair ───────────────────────────────────────────────────────────────────

/**
 * Best-effort repair of an invalid slug.
 *
 * If the slug looks like it was generated from a long title or content
 * (> 80 chars) we re-run it through generateSlug.
 * If it contains special characters we sanitise only.
 */
export function repairSlug(slug: string, maxLen = 80): string {
  if (isValidSlug(slug, maxLen)) return slug;
  return generateSlug(slug, maxLen);
}
