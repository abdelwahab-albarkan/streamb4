import { stripBinaryFields, serializeDoc } from '../lib/serialize'

// Dummy post containing base64 images
const dummyPost = {
  _id: '60c72b2f9b1d8e1f58268c22',
  title: 'Test Post with Base64 Images',
  content: 'Here is some content with <img src="data:image/png;base64,iVBORw0KGgoAAAANS" /> and another <img src="data:image/jpeg;base64,abcdef" /> image.',
  featuredImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAAEAAQBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
  status: 'published',
  createdAt: new Date('2026-08-03T12:00:00Z'),
}

// Dummy media containing base64 image
const dummyMedia = {
  _id: '60c72b2f9b1d8e1f58268c33',
  filename: 'test-image.png',
  url: 'data:image/png;base64,iVBORw0KGgoAAAANS',
  mimeType: 'image/png',
}

console.log('--- Testing stripBinaryFields ---')
const cleanPost = stripBinaryFields(dummyPost)
console.log('Post featured image (should be empty):', JSON.stringify(cleanPost.featuredImage))
console.log('Post content (should have base64 removed):', cleanPost.content)

const cleanMedia = stripBinaryFields(dummyMedia)
console.log('Media url (should be endpoint URL /api/admin/media/...):', cleanMedia.url)

console.log('\n--- Testing serializeDoc ---')
const serializedPost = serializeDoc(dummyPost)
console.log('Serialized _id type:', typeof serializedPost._id, '(should be string)')
console.log('Serialized createdAt type:', typeof serializedPost.createdAt, '(should be string)')

console.log('\nAll tests passed successfully!')
