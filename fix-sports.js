const { MongoClient } = require('./node_modules/mongodb/lib/index.js');
const URI = 'mongodb+srv://streamb4admin:Streamb4Secure2026@cluster0.uthegbn.mongodb.net/streamb4?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(URI);
client.connect().then(async () => {
  const col = client.db('streamb4').collection('posts');
  const p = await col.findOne({ slug: 'best-sports-iptv-providers-2026' }, { projection: { content: 1 } });
  let c = p.content;
  c = c.replaceAll('from just $5.83/month', 'from $39.99 for 3 months');
  c = c.replace('| From $5.83 |', '| From $5.83/mo equiv. |');
  await col.updateOne({ slug: 'best-sports-iptv-providers-2026' }, { $set: { content: c, updatedAt: new Date() } });
  console.log('Fixed sports article');
  await client.close();
}).catch(e => console.error(e));
