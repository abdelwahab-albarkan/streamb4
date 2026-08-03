import { connectDB } from '@/lib/mongodb'
import { Media, IMedia } from '@/lib/models/Media'

/**
 * Interface representing the result of storing a media file.
 */
export interface MediaStoreResult {
  url: string;      // URL to be stored in the database
  mimeType: string;
  size: number;
}

/**
 * Store a file in the media storage.
 * Currently converts to a base64 Data URL (stored directly in MongoDB for portability),
 * but is structured to easily support external storage providers (like S3, Cloudinary, Vercel Blob) in the future.
 */
export async function storeMedia(file: File): Promise<MediaStoreResult> {
  // To support external storage in the future, modify this function.
  // Example for S3/Blob storage:
  // const uploadResult = await s3Client.upload(...);
  // return { url: uploadResult.Location, mimeType: file.type, size: file.size };

  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')
  const dataUrl = `data:${file.type};base64,${base64}`

  return {
    url: dataUrl,
    mimeType: file.type,
    size: file.size,
  }
}
