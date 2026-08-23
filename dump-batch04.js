const { MongoClient } = require('./node_modules/mongodb/lib/index.js');
const URI = 'mongodb+srv://streamb4admin:Streamb4Secure2026@cluster0.uthegbn.mongodb.net/streamb4?retryWrites=true&w=majority&appName=Cluster0';
const SLUGS = [
  'best-iptv-service-firestick-2026',
  'how-to-set-up-iptv-on-samsung-smart-tv-2026',
  'best-iptv-apps-for-apple-tv-2026',
  'is-iptv-legal-in-the-usa-the-complete-2026-guide',
  'is-iptv-safe-to-use-in-canada',
  'best-iptv-apps-lg-smart-tv-2026',
  'best-iptv-apps-samsung-smart-tv-2026',
  'best-iptv-in-2026-top-iptv-services-compared-for-streaming-sports-4k',
  'best-sports-iptv-providers-2026',
  'the-complete-world-cup-2026-streaming-guide-how-to-watch-every-match-live-in-4k',
];
const client = new MongoClient(URI);
client.connect().then(async () => {
  const col = client.db('streamb4').collection('posts');
  for (const slug of SLUGS) {
    const p = await col.findOne({ slug }, { projection: { _id:0, slug:1, title:1, seoTitle:1, metaDescription:1, content:1 } });
    if (!p) { console.log(`NOT FOUND: ${slug}`); continue; }
    console.log(`\n${'='.repeat(80)}`);
    console.log(`SLUG: ${p.slug}`);
    console.log(`TITLE: ${p.title}`);
    console.log(`LEN: ${(p.content||'').length}`);
    console.log(`CONTENT:\n${p.content}`);
  }
  await client.close();
}).catch(e => { console.error(e); process.exit(1); });
