import { connectDB } from '@/lib/mongodb'
import { Media } from '@/lib/models/Media'
import { serializeDocs, jsonResponse } from '@/lib/serialize'
import { storeMedia } from '@/lib/mediaStorage'

// 4 MB — leaves margin below Vercel's 4.5 MB route-handler body limit
const MAX_BYTES = 4 * 1024 * 1024

export async function GET() {
  try {
    await connectDB()
    const docs = await Media.find({}).select("-url").sort({ createdAt: -1 }).lean()
    const serialized = serializeDocs(docs as any[])
    const items = serialized.map((item: any) => ({
      ...item,
      url: `/api/admin/media/${item._id}`,
    }))
    return jsonResponse('GET /api/admin/media', { success: true, items })
  } catch (err: any) {
    return jsonResponse('GET /api/admin/media [ERROR]', { success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || !file.size) {
      return jsonResponse('POST /api/admin/media [BAD REQUEST]', { success: false, error: 'No file provided' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return jsonResponse('POST /api/admin/media [PAYLOAD TOO LARGE]', 
        { success: false, error: 'File too large — maximum size is 4 MB.' },
        { status: 413 }
      )
    }
    if (!file.type.startsWith('image/')) {
      return jsonResponse('POST /api/admin/media [UNSUPPORTED MEDIA]', 
        { success: false, error: 'Only image files are accepted.' },
        { status: 415 }
      )
    }

    const width   = formData.get('width')   ? Number(formData.get('width'))  : null
    const height  = formData.get('height')  ? Number(formData.get('height')) : null
    const altText = (formData.get('altText') as string | null) ?? ''

    // Store the media file using the storage abstraction (supports S3/Blob in the future)
    const storageResult = await storeMedia(file)

    await connectDB()
    const doc = await new Media({
      filename: file.name,
      url:      storageResult.url,
      mimeType: storageResult.mimeType,
      size:     storageResult.size,
      width,
      height,
      altText,
    }).save()

    return jsonResponse('POST /api/admin/media', {
      success: true,
      item: doc.toObject(),
    })
  } catch (err: any) {
    return jsonResponse('POST /api/admin/media [ERROR]', { success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) {
      return jsonResponse('DELETE /api/admin/media [BAD REQUEST]', { success: false, error: 'Missing id param' }, { status: 400 })
    }
    await connectDB()
    await Media.findByIdAndDelete(id)
    return jsonResponse('DELETE /api/admin/media', { success: true })
  } catch (err: any) {
    return jsonResponse('DELETE /api/admin/media [ERROR]', { success: false, error: err.message }, { status: 500 })
  }
}
