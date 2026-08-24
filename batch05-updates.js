const { MongoClient } = require('./node_modules/mongodb/lib/index.js');
const URI = 'mongodb+srv://streamb4admin:Streamb4Secure2026@cluster0.uthegbn.mongodb.net/streamb4?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(URI);

async function updatePost(col, slug, transform) {
  const p = await col.findOne({ slug }, { projection: { content: 1 } });
  if (!p) { console.log(`NOT FOUND: ${slug}`); return; }
  const before = p.content;
  const after = transform(before);
  if (before === after) { console.log(`NO CHANGE: ${slug}`); return; }
  await col.updateOne({ slug }, { $set: { content: after, updatedAt: new Date() } });
  console.log(`UPDATED: ${slug}`);
}

client.connect().then(async () => {
  const col = client.db('streamb4').collection('posts');

  // POST 1: install-streamb4-smart-tv
  // Fix Sony section: article titles used as anchor text instead of "Android TV" and "Google Play Store"
  await updatePost(col, 'install-streamb4-smart-tv', c => {
    c = c.replace(
      'Sony TVs running [Best IPTV for Android TV in 2026: Top Apps & Services Compared](https://streamb4.com/blog/best-iptv-for-android-tv-2026) give you direct access to the [Best IPTV Apps for Google TV in 2026 (Tested & Ranked)](https://streamb4.com/blog/best-iptv-apps-for-google-tv-in-2026-tested-ranked) Play Store',
      'Sony TVs running [Android TV](https://streamb4.com/blog/best-iptv-for-android-tv-2026) give you direct access to the [Google Play Store](https://streamb4.com/blog/best-iptv-apps-for-google-tv-in-2026-tested-ranked)'
    );
    return c;
  });

  // POST 2: watch-live-sports-streamb4
  // Fix ALL-CAPS Premier League title in body and Related Guides
  await updatePost(col, 'watch-live-sports-streamb4', c => {
    c = c.replaceAll(
      '[THE COMPLETE GUIDE TO HOW TO WATCH PREMIER LEAGUE ON FIRESTICK (2026 EDITION)](https://streamb4.com/blog/how-to-watch-premier-league-on-firestick)',
      '[How to Watch Premier League on Firestick (2026 Edition)](https://streamb4.com/blog/how-to-watch-premier-league-on-firestick)'
    );
    return c;
  });

  // POST 3: 4k-streaming-guide-2026
  // Fix ALL-CAPS Live TV title (body + Related Guides), ALL-CAPS USA title (FAQ + Related Guides),
  // ALL-CAPS Canada title (Related Guides), and "$9/month" CTA
  await updatePost(col, '4k-streaming-guide-2026', c => {
    c = c.replaceAll(
      '[THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      '[live TV streaming guide](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );
    c = c.replaceAll(
      '[THE COMPLETE BEST IPTV FOR USA 2026 GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-usa-2026)',
      '[Best IPTV for USA 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-usa-2026)'
    );
    c = c.replaceAll(
      '[THE COMPLETE BEST IPTV FOR CANADA (2026) : EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)',
      '[Best IPTV for Canada 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)'
    );
    c = c.replace('starting from $9/month.', 'starting from $39.99 for 3 months.');
    return c;
  });

  // POST 4: streamb4-vs-cable-tv-2026
  // Fix price table (wrong monthly cost range, wrong simultaneous screens), body pricing errors,
  // draft link (body + Related Guides), savings calculator table, Duo plan pricing, CTA pricing
  await updatePost(col, 'streamb4-vs-cable-tv-2026', c => {
    // Price comparison table — label and value
    c = c.replace(
      '| Monthly cost | $100–$200 | $9–$46 |',
      '| Subscription cost | $100–$200/month | $39.99–$165 per period |'
    );
    // Simultaneous screens — max is 3, not 6
    c = c.replace(
      '| Simultaneous screens | 1–2 per box | Up to 6 |',
      '| Simultaneous screens | 1–2 per box | Up to 3 |'
    );
    // Body: channel count section pricing
    c = c.replace(
      '50,000+ channels starting at $9/month',
      '50,000+ channels starting from $39.99 for 3 months'
    );
    // Draft link — body and Related Guides (replaceAll covers both)
    c = c.replaceAll(
      '[Best Reliable Sports IPTV Providers in 2026 (Complete Comparison)](https://streamb4.com/blog/draft-1784162544682)',
      '[Best Reliable Sports IPTV Providers in 2026](https://streamb4.com/blog/best-sports-iptv-providers-2026)'
    );
    // IPTV Advantages section — simultaneous screens
    c = c.replace(
      '- **Up to 6 simultaneous screens**',
      '- **Up to 3 simultaneous screens**'
    );
    // Annual Savings Calculator table — Solo pricing was $9/mo ($108/yr), correct is $69.99/yr
    c = c.replace(
      '| Your Cable Bill | STREAMB4 Solo ($9/mo) | Annual Saving |\n|---|---|---|\n| $100/month | $108/year | $1,092/year |\n| $150/month | $108/year | $1,692/year |\n| $200/month | $108/year | $2,292/year |',
      '| Your Cable Bill | STREAMB4 Solo (12-month) | Annual Saving |\n|---|---|---|\n| $100/month | $69.99/year | $1,130/year |\n| $150/month | $69.99/year | $1,730/year |\n| $200/month | $69.99/year | $2,330/year |'
    );
    // Duo plan paragraph
    c = c.replace(
      'Even on the Duo plan ($17.99/month, 2 screens), you save over $1,500 per year compared to a $150 cable bill.',
      'Even on the Duo plan ($120/year, 2 screens), you save over $1,600 per year compared to a $150 cable bill.'
    );
    // CTA pricing
    c = c.replace(
      'plans from $9/month, no contracts',
      'plans from $39.99 for 3 months, no contracts'
    );
    return c;
  });

  // POST 5: best-movies-series-streamb4-june-2026
  // Fix "$9/month" CTA, ALL-CAPS USA and Canada titles in Related Guides
  await updatePost(col, 'best-movies-series-streamb4-june-2026', c => {
    c = c.replace(
      '[see all plans](https://streamb4.com/pricing) from $9/month.',
      '[see all plans](https://streamb4.com/pricing) from $39.99 for 3 months.'
    );
    c = c.replaceAll(
      '[THE COMPLETE BEST IPTV FOR USA 2026 GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-usa-2026)',
      '[Best IPTV for USA 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-usa-2026)'
    );
    c = c.replaceAll(
      '[THE COMPLETE BEST IPTV FOR CANADA (2026) : EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)',
      '[Best IPTV for Canada 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)'
    );
    return c;
  });

  // POST 6: vpn-streamb4-privacy-guide — CLEAN, skip

  // POST 7: streamb4-reseller-program-guide
  // Fix ALL-CAPS USA title in body and Related Guides
  await updatePost(col, 'streamb4-reseller-program-guide', c => {
    c = c.replaceAll(
      '[THE COMPLETE BEST IPTV FOR USA 2026 GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-usa-2026)',
      '[Best IPTV for USA 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-usa-2026)'
    );
    return c;
  });

  // POST 8: fix-iptv-buffering-issues-2026
  // Fix ALL-CAPS Live TV title (body + Related Guides), "26 edge servers" unsourced count,
  // ALL-CAPS Canada title (body prevention + Related Guides),
  // ALL-CAPS USA title (body prevention + Related Guides)
  await updatePost(col, 'fix-iptv-buffering-issues-2026', c => {
    c = c.replaceAll(
      '[THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      '[live TV streaming guide](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );
    // Remove unsourced server count
    c = c.replace(
      'STREAMB4 operates 26 edge servers with automatic failover',
      'STREAMB4 uses automatic failover'
    );
    c = c.replaceAll(
      '[THE COMPLETE BEST IPTV FOR CANADA (2026) : EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)',
      '[Best IPTV for Canada 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)'
    );
    c = c.replaceAll(
      '[THE COMPLETE BEST IPTV FOR USA 2026 GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-usa-2026)',
      '[Best IPTV for USA 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-usa-2026)'
    );
    return c;
  });

  // POST 9: best-devices-iptv-streaming-2026 — CLEAN, skip

  await client.close();
  console.log('BATCH 05 DONE');
}).catch(e => { console.error(e); process.exit(1); });
