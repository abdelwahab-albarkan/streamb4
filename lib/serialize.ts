import { NextResponse } from 'next/server'

/**
 * lib/serialize.ts
 *
 * Converts Mongoose lean() results into plain RSC-serializable objects.
 * Also strips binary / base64 image data from responses to prevent payload bloat.
 *
 * Problem: Mongoose's .lean() returns raw MongoDB documents. These contain
 * ObjectId instances for the `_id` field (and any ObjectId reference fields).
 * ObjectId is a class instance — React's RSC serializer rejects it, causing
 * blank pages on client-side navigation.
 *
 * Solution: Walk the document tree and convert every ObjectId → hex string
 * and every Date → ISO 8601 string. All primitives and plain objects pass
 * through untouched.
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
 * Recursively walks a document/object and strips any base64/binary image data.
 * - If the object is a Media document (contains _id/id and filename/mimeType),
 *   we ensure its `url` is resolved to a clean public URL `/api/admin/media/${id}` rather than returning
 *   the raw base64 data.
 * - Any string field containing exactly a base64 data URL (e.g. starting with `data:image/`)
 *   is replaced with an empty string or a placeholder.
 * - Any string field like `content` that contains inline base64 images is sanitized
 *   using a regex to strip the huge base64 payload.
 */
export function stripBinaryFields<T>(doc: T): T {
  if (doc === null || doc === undefined) return doc

  if (doc instanceof Date) return doc

  if (isObjectId(doc)) return doc

  if (Array.isArray(doc)) {
    return (doc as unknown[]).map(stripBinaryFields) as unknown as T
  }

  if (typeof doc === 'object') {
    const obj = doc as Record<string, unknown>
    
    // Check if this object represents a Media document (Mongoose lean or plain object)
    const isMedia = (obj._id || obj.id) && typeof obj.filename === 'string' && typeof obj.mimeType === 'string'
    const docId = obj._id ? String(obj._id) : (obj.id ? String(obj.id) : '')
    
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string') {
        if (isMedia && k === 'url' && v.startsWith('data:image/')) {
          // Replace full base64 data URL with the serving endpoint URL
          out[k] = `/api/admin/media/${docId}`
        } else if (v.startsWith('data:image/') && v.includes(';base64,')) {
          // Exactly a base64 data URL (e.g., featuredImage), strip it!
          out[k] = ''
        } else if (k === 'content' || k === 'excerpt' || k === 'outline') {
          // Strip inline base64 images from content/excerpt strings
          out[k] = v.replace(/data:image\/[^;]+;base64,[^"'\s)]+/g, '')
        } else {
          out[k] = v
        }
      } else {
        out[k] = stripBinaryFields(v)
      }
    }
    return out as unknown as T
  }

  return doc
}

/**
 * Recursively serialize a single lean document (or any nested value).
 * Safe to call on null / undefined / primitives — they pass through unchanged.
 */
export function serializeDoc<T>(doc: T): T {
  const cleanDoc = stripBinaryFields(doc)
  return serializeDocRaw(cleanDoc)
}

function serializeDocRaw<T>(doc: T): T {
  // null / undefined
  if (doc === null || doc === undefined) return doc

  // ObjectId → string
  if (isObjectId(doc)) return (doc as unknown as { toHexString(): string }).toHexString() as unknown as T

  // Date → ISO string
  if (doc instanceof Date) return doc.toISOString() as unknown as T

  // Array → recurse each element
  if (Array.isArray(doc)) return (doc as unknown[]).map(serializeDocRaw) as unknown as T

  // Plain object → recurse each value
  if (typeof doc === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(doc as Record<string, unknown>)) {
      out[k] = serializeDocRaw(v)
    }
    return out as unknown as T
  }

  // Primitive (string, number, boolean, bigint, symbol)
  return doc
}

/**
 * Serialize an array of lean documents.
 */
export function serializeDocs<T>(docs: T[]): T[] {
  return docs.map(serializeDoc)
}

/**
 * Creates a size-monitored, protection-capped JSON response.
 * Automatically serializes objects using `serializeDoc` (which strips base64/binary payloads).
 */
export function jsonResponse(apiName: string, data: any, init?: ResponseInit) {
  const serialized = serializeDoc(data)
  const jsonString = JSON.stringify(serialized)
  const bytes = Buffer.byteLength(jsonString, 'utf8')
  
  console.log(`[API Size Log] ${apiName}: ${bytes} bytes (${(bytes / 1024 / 1024).toFixed(3)} MB)`)
  
  // Protect against oversized payloads (Vercel limit: 4.5 MB)
  const MAX_BYTES = 4 * 1024 * 1024 // 4 MB safety limit
  if (bytes > MAX_BYTES) {
    console.error(`[API Size Alert] Response payload for ${apiName} exceeds 4 MB safety limit: ${bytes} bytes`)
    return NextResponse.json(
      { success: false, error: 'Response payload too large. Request aborted.' },
      { status: 413 }
    )
  }
  
  const headers = new Headers(init?.headers)
  headers.set('Content-Length', String(bytes))
  
  return new NextResponse(jsonString, {
    ...init,
    status: init?.status ?? 200,
    headers,
  })
}

/**
 * Creates a size-monitored, protection-capped XML response.
 */
export function xmlResponse(apiName: string, xmlString: string, init?: ResponseInit) {
  const bytes = Buffer.byteLength(xmlString, 'utf8')
  
  console.log(`[API Size Log] ${apiName} (XML): ${bytes} bytes (${(bytes / 1024 / 1024).toFixed(3)} MB)`)
  
  // Protect against oversized payloads (Vercel limit: 4.5 MB)
  const MAX_BYTES = 4 * 1024 * 1024 // 4 MB safety limit
  if (bytes > MAX_BYTES) {
    console.error(`[API Size Alert] XML response payload for ${apiName} exceeds 4 MB safety limit: ${bytes} bytes`)
    return NextResponse.json(
      { success: false, error: 'Response payload too large. Request aborted.' },
      { status: 413 }
    )
  }
  
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/xml')
  headers.set('Content-Length', String(bytes))
  
  return new NextResponse(xmlString, {
    ...init,
    status: init?.status ?? 200,
    headers,
  })
}
