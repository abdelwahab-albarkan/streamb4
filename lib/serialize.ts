/**
 * lib/serialize.ts
 *
 * Converts Mongoose lean() results into plain RSC-serializable objects.
 *
 * Problem: Mongoose's .lean() returns raw MongoDB documents. These contain
 * ObjectId instances for the `_id` field (and any ObjectId reference fields).
 * ObjectId is a class instance — React's RSC serializer rejects it, causing
 * blank pages on client-side navigation.
 *
 * Solution: Walk the document tree and convert every ObjectId → hex string
 * and every Date → ISO 8601 string. All primitives and plain objects pass
 * through untouched.
 *
 * Why not JSON.parse(JSON.stringify(doc))?
 *   • Double allocation: stringify builds the full string, parse rebuilds the object.
 *   • This utility is O(n) in one pass with no intermediate string.
 *   • Handles circular-safe structures (Mongoose lean results never have cycles).
 *
 * Usage:
 *   import { serializeDoc, serializeDocs } from '@/lib/serialize'
 *
 *   const post  = await Post.findOne({ slug }).lean()
 *   return serializeDoc(post)
 *
 *   const posts = await Post.find({}).lean()
 *   return serializeDocs(posts)
 */

/** Returns true when a value is a Mongoose / mongodb-driver ObjectId instance. */
function isObjectId(v: unknown): boolean {
  return (
    v !== null &&
    typeof v === 'object' &&
    typeof (v as Record<string, unknown>).toHexString === 'function'
  )
}

/**
 * Recursively serialize a single lean document (or any nested value).
 * Safe to call on null / undefined / primitives — they pass through unchanged.
 */
export function serializeDoc<T>(doc: T): T {
  // null / undefined
  if (doc === null || doc === undefined) return doc

  // ObjectId → string
  if (isObjectId(doc)) return (doc as unknown as { toHexString(): string }).toHexString() as unknown as T

  // Date → ISO string
  if (doc instanceof Date) return doc.toISOString() as unknown as T

  // Array → recurse each element
  if (Array.isArray(doc)) return (doc as unknown[]).map(serializeDoc) as unknown as T

  // Plain object → recurse each value
  if (typeof doc === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(doc as Record<string, unknown>)) {
      out[k] = serializeDoc(v)
    }
    return out as unknown as T
  }

  // Primitive (string, number, boolean, bigint, symbol)
  return doc
}

/**
 * Serialize an array of lean documents.
 * Equivalent to docs.map(serializeDoc) but typed cleanly.
 */
export function serializeDocs<T>(docs: T[]): T[] {
  return docs.map(serializeDoc)
}
