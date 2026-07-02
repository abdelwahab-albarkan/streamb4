export interface TocItem {
  level: number
  text: string
  id: string
}

/**
 * Strip markdown inline formatting so the visible TOC text is clean.
 * Handles: **bold**, *italic*, `code`, [link](url), ~~strike~~, <html-tags>
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')                   // HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // [link](url) → link
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')       // ![img](url) → remove
    .replace(/\*\*(.+?)\*\*/g, '$1')            // **bold**
    .replace(/\*(.+?)\*/g, '$1')                // *italic*
    .replace(/~~(.+?)~~/g, '$1')               // ~~strike~~
    .replace(/`(.+?)`/g, '$1')                  // `code`
    .trim()
}

/**
 * Generate a heading anchor ID that matches the algorithm used by github-slugger,
 * which is what rehype-slug (bundled inside @uiw/react-markdown-preview) uses.
 *
 * Algorithm:
 *   1. Lowercase
 *   2. Remove characters that are not alphanumeric, space, hyphen, or underscore
 *   3. Replace whitespace runs with a single hyphen
 *   4. Replace underscores with hyphens
 *   5. Collapse multiple hyphens
 *   6. Trim leading/trailing hyphens
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // keep: word chars (a-z0-9_), spaces, hyphens
    .replace(/[\s]+/g, '-')     // spaces → hyphens
    .replace(/_/g, '-')         // underscores → hyphens
    .replace(/-{2,}/g, '-')     // collapse consecutive hyphens
    .replace(/^-+|-+$/g, '')    // trim leading/trailing hyphens
}

/**
 * Extract H2 / H3 headings from raw markdown content.
 * Returns TocItem[] with clean display text and anchor IDs matching rehype-slug output.
 */
export function extractToc(content: string): TocItem[] {
  if (!content) return []

  // Match lines starting with ## or ### (H2 / H3)
  const headings = content.match(/^#{2,3} .+/gm) ?? []
  const idCount: Record<string, number> = {}

  return headings.map((h) => {
    const level = (h.match(/^#+/)?.[0].length ?? 2) as 2 | 3
    const raw = h.replace(/^#+\s+/, '')
    const text = stripMarkdown(raw)
    const baseId = generateHeadingId(raw)

    // Handle duplicate headings the same way github-slugger does
    const count = idCount[baseId] ?? 0
    idCount[baseId] = count + 1
    const id = count === 0 ? baseId : `${baseId}-${count}`

    return { level, text, id }
  })
}
