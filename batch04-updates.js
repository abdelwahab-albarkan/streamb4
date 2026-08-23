const { MongoClient } = require('./node_modules/mongodb/lib/index.js');
const URI = 'mongodb+srv://streamb4admin:Streamb4Secure2026@cluster0.uthegbn.mongodb.net/streamb4?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(URI);

async function updatePost(col, slug, transformFn) {
  const post = await col.findOne({ slug }, { projection: { _id: 0, content: 1 } });
  if (!post) { console.log(`NOT FOUND: ${slug}`); return; }
  const newContent = transformFn(post.content || '');
  if (newContent === post.content) {
    console.log(`NO CHANGE: ${slug}`);
    return;
  }
  await col.updateOne({ slug }, { $set: { content: newContent, updatedAt: new Date() } });
  console.log(`UPDATED: ${slug}`);
}

client.connect().then(async () => {
  const col = client.db('streamb4').collection('posts');

  // ── POST 1: best-iptv-service-firestick-2026 ──────────────────────────────
  await updatePost(col, 'best-iptv-service-firestick-2026', (c) => {
    // Quick answer pricing
    c = c.replace('plans from $9/month', 'Plans from $39.99 for 3 months');

    // Why section: remove unsourced "26 edge servers across four continents"
    c = c.replace(
      'The service uses 26 edge servers across four continents, routing each stream through the lowest-latency path automatically.',
      'The service routes each stream through a global CDN, finding the lowest-latency path automatically.'
    );

    // Key Features table: fix "26 servers" and "1 to 6"
    c = c.replace(
      '| Anti-Freeze Tech | Adaptive CDN routing across 26 servers |',
      '| Anti-Freeze Tech | Adaptive CDN routing |'
    );
    c = c.replace(
      '| Simultaneous Connections | 1 to 6 (depending on plan) |',
      '| Simultaneous Connections | 1 to 3 (Solo: 1, Duo: 2, Family: 3) |'
    );

    // Pricing section header + table: remove 6-plan fake table, replace with correct 3-plan table
    c = c.replace(
      `STREAMB4 offers six plans with no contracts and instant activation.

| Plan | Connections | Monthly | 12-Month |
|---|---|---|---|
| Solo | 1 screen | $9.00/mo | $5.83/mo equivalent |
| Duo | 2 screens | $17.99/mo | $10.00/mo equivalent |
| Family | 3 screens | $24.99/mo | $13.33/mo equivalent |
| Home | 4 screens | $31.99/mo | $16.67/mo equivalent |
| Extended | 5 screens | $38.99/mo | $20.00/mo equivalent |
| Ultimate | 6 screens | $45.99/mo | $23.33/mo equivalent |`,
      `STREAMB4 offers three plans with no contracts and instant activation.

| Plan | Connections | 3 Months | 6 Months | 12 Months |
|---|---|---|---|---|
| Solo | 1 screen | $39.99 | $54.99 | $69.99 |
| Duo | 2 screens | $55.00 | $75.00 | $120.00 |
| Family | 3 screens | $70.00 | $94.00 | $165.00 |`
    );

    // Body inline old-title links
    c = c.replace(
      '[THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      '[our live TV streaming guide](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );
    c = c.replace(
      "If you're in the US, see our guide to [THE COMPLETE BEST IPTV FOR USA 2026 GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-usa-2026). Canadian users should check the [THE COMPLETE BEST IPTV FOR CANADA (2026) : EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian) for region-specific channel information.",
      "If you're in the US, see our [US IPTV guide](https://streamb4.com/blog/best-iptv-for-usa-2026). Canadian users should check our [Canada IPTV guide](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian) for region-specific channel information."
    );

    // Related Guides: fix ALL-CAPS titles
    c = c.replace(
      '- [THE COMPLETE BEST IPTV FOR USA 2026 GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-usa-2026)',
      '- [Best IPTV for USA 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-usa-2026)'
    );
    c = c.replace(
      '- [THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      '- [Live TV Streaming Guide 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );
    c = c.replace(
      '- [THE COMPLETE BEST IPTV FOR CANADA (2026) : EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)',
      '- [Best IPTV for Canada 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)'
    );

    return c;
  });

  // ── POST 2: how-to-set-up-iptv-on-samsung-smart-tv-2026 ──────────────────
  await updatePost(col, 'how-to-set-up-iptv-on-samsung-smart-tv-2026', (c) => {
    // Replace Germany-specific body section header with general version
    c = c.replace(
      '## Is IPTV Legal in Germany?\n\nThis question comes up frequently.',
      '## Is IPTV Legal?\n\nThis question comes up frequently.'
    );

    // Replace Germany-specific FAQ entry
    c = c.replace(
      '### Is IPTV legal in Germany?\nThe technology is legal. The legality of a service depends on whether it holds the rights to the content.',
      '### Is IPTV legal?\nIPTV technology is legal. The legality of a specific service depends on whether the provider holds the rights to the content it streams.'
    );

    // Remove AI artifact sections from "Internal Links Used" to end of document
    const cutIndex = c.indexOf('\n## Internal Links Used');
    if (cutIndex > -1) {
      c = c.substring(0, cutIndex);
    }

    return c;
  });

  // ── POST 3: best-iptv-apps-for-apple-tv-2026 ─────────────────────────────
  await updatePost(col, 'best-iptv-apps-for-apple-tv-2026', (c) => {
    // Intro: full article title used as "players" anchor text
    c = c.replace(
      'free and premium [Best IPTV Players for Android TV in 2026 (Compared & Ranked)](https://streamb4.com/blog/best-iptv-players-for-android-tv-in-2026-compared-ranked), installation steps',
      'free and premium [IPTV players](https://streamb4.com/blog/best-iptv-players-for-android-tv-in-2026-compared-ranked), installation steps'
    );

    // Quick Summary: draft post link in iPlayTV bullet
    c = c.replace(
      '✔ **Best native Apple option:** iPlayTV — optimized for tvOS, [Best Reliable Sports IPTV Providers in 2026 (Complete Comparison)](https://streamb4.com/blog/draft-1784162544682) EPG and catch-up',
      '✔ **Best native Apple option:** iPlayTV — optimized for tvOS, with reliable EPG and catch-up'
    );

    // "Why You Can Trust STREAMB4": article title used inline
    c = c.replace(
      'STREAMB4 operates and supports live IPTV [Best IPTV in 2026: Top IPTV Services Compared for Streaming, Sports & 4K](https://streamb4.com/blog/best-iptv-in-2026-top-iptv-services-compared-for-streaming-sports-4k) in production',
      'STREAMB4 operates and supports live IPTV services in production'
    );

    // Related Guides: remove draft link entry
    c = c.replace(
      '\n- [Best Reliable Sports IPTV Providers in 2026 (Complete Comparison)](https://streamb4.com/blog/draft-1784162544682)',
      ''
    );

    return c;
  });

  // ── POST 4: is-iptv-legal-in-the-usa-the-complete-2026-guide ─────────────
  await updatePost(col, 'is-iptv-legal-in-the-usa-the-complete-2026-guide', (c) => {
    // Intro: old title as inline body text
    c = c.replace(
      'This [THE COMPLETE BEST IPTV FOR USA 2026 GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-usa-2026) breaks down',
      'This guide breaks down'
    );
    c = c.replace(
      'what actually happens if you use an unlicensed [Best IPTV Service for Firestick 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-service-firestick-2026), so you can',
      'what actually happens if you use an unlicensed IPTV service, so you can'
    );

    // Quick Summary: article titles as anchor text
    c = c.replace(
      'The FCC does not license individual [Complete 4K Streaming Guide 2026 — Everything You Need to Know](https://streamb4.com/blog/4k-streaming-guide-2026) services',
      'The FCC does not license individual streaming services'
    );
    c = c.replace(
      'Unlike [THE COMPLETE BEST IPTV FOR CANADA (2026) : EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)\'s CRTC',
      "Unlike Canada's CRTC"
    );

    // Final Verdict CTA: pricing
    c = c.replaceAll('Plans start at just $5.83/month.', 'Plans from $39.99 for 3 months.');

    // Related Guides: fix ALL-CAPS titles
    c = c.replace(
      '- [THE COMPLETE BEST IPTV FOR USA 2026 GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-usa-2026)',
      '- [Best IPTV for USA 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-usa-2026)'
    );
    c = c.replace(
      '- [THE COMPLETE BEST IPTV FOR CANADA (2026) : EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)',
      '- [Best IPTV for Canada 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-canada-2026-complete-guide-for-canadian)'
    );

    return c;
  });

  // ── POST 5: is-iptv-safe-to-use-in-canada ────────────────────────────────
  await updatePost(col, 'is-iptv-safe-to-use-in-canada', (c) => {
    // Intro: old title as inline text
    c = c.replace(
      'this [THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026) guide covers',
      'this guide covers'
    );

    // Quick Summary: article title used as "service" anchor text
    c = c.replace(
      'STREAMB4 offers a licensed IPTV [Best IPTV Service for Firestick 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-service-firestick-2026) with over 50,000',
      'STREAMB4 offers a licensed IPTV service with over 50,000'
    );

    // CTA: pricing
    c = c.replaceAll('Plans start at just $5.83/month.', 'Plans from $39.99 for 3 months.');

    // Related Guides: ALL-CAPS title
    c = c.replace(
      '- [THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      '- [Live TV Streaming Guide 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );

    return c;
  });

  // ── POST 6: best-iptv-apps-lg-smart-tv-2026 ──────────────────────────────
  await updatePost(col, 'best-iptv-apps-lg-smart-tv-2026', (c) => {
    // Intro: draft link used as word "reliable"
    c = c.replace(
      'clean interface, and [reliable](/blog/draft-1784162544682) performance.',
      'clean interface, and reliable performance.'
    );

    // "What Is IPTV" section: second draft link as "reliable"
    c = c.replace(
      'For a [reliable](/blog/draft-1784162544682) IPTV [service](/blog/best-iptv-service-firestick-2026), con',
      'For a reliable IPTV [service](/blog/best-iptv-service-firestick-2026), con'
    );

    // "Why LG Smart TVs" section: article title used as "Android" anchor text
    c = c.replace(
      'not as extensive as [Best IPTV for Android TV in 2026: Top Apps & Services Compared](https://streamb4.com/blog/best-iptv-for-android-tv-2026) TV',
      'not as extensive as [Android TV](https://streamb4.com/blog/best-iptv-for-android-tv-2026)'
    );

    // "Understanding webOS" section: article title used as "Google" in "Google Play Store"
    c = c.replace(
      'Android TV uses the [Best IPTV Apps for Google TV in 2026 (Tested & Ranked)](https://streamb4.com/blog/best-iptv-apps-for-google-tv-in-2026-tested-ranked) Play Store',
      'Android TV uses the [Google Play Store](https://streamb4.com/blog/best-iptv-apps-for-google-tv-in-2026-tested-ranked)'
    );

    // "What Makes Great IPTV App" section: article title as "provider"
    c = c.replace(
      'giving you flexibility with your IPTV [Best IPTV Service for Firestick 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-service-firestick-2026).',
      'giving you flexibility with your IPTV [provider](https://streamb4.com/blog/best-iptv-service-firestick-2026).'
    );

    // CTA pricing
    c = c.replaceAll('Plans start at just $5.83/month.', 'Plans from $39.99 for 3 months.');

    return c;
  });

  // ── POST 7: best-iptv-apps-samsung-smart-tv-2026 ─────────────────────────
  await updatePost(col, 'best-iptv-apps-samsung-smart-tv-2026', (c) => {
    // Intro: article title replaces "Smart" in "Samsung Smart TV"
    c = c.replace(
      'Looking for the best IPTV apps for Samsung [Best IPTV Apps for LG Smart TV in 2026 (Tested & Ranked)](https://streamb4.com/blog/best-iptv-apps-lg-smart-tv-2026) TV in 2026?',
      'Looking for the best IPTV apps for Samsung Smart TV in 2026?'
    );

    // Warning box: article title used as "players"
    c = c.replace(
      'This article reviews IPTV [Best IPTV Players for Android TV in 2026 (Compared & Ranked)](https://streamb4.com/blog/best-iptv-players-for-android-tv-in-2026-compared-ranked) only.',
      'This article reviews IPTV players only.'
    );

    // Warning box: draft link used as "reliable"
    c = c.replace(
      'For a [reliable](/blog/draft-1784162544682) IPTV [service](/blog/best-iptv-service-firestick-2026), consider STREAMB4',
      'For a reliable IPTV [service](/blog/best-iptv-service-firestick-2026), consider STREAMB4'
    );

    // FAQ: "Family plan supports up to 6 screens"
    c = c.replace(
      'the Duo plan supports 2 screens, and the Family plan supports up to 6 screens.',
      'the Duo plan supports 2 screens, and the Family plan supports up to 3 screens.'
    );
    c = c.replace(
      'STREAMB4 offers plans from 1 to 6 simultaneous connections. The Solo plan supports 1 screen, the Duo plan supports 2 screens, and the Family plan supports up to 6 screens.',
      'STREAMB4 offers three plans: Solo (1 screen), Duo (2 screens), and Family (3 screens).'
    );

    // Pricing comparison table
    c = c.replace(
      '| STREAMB4 | $9.00 | $24.00 | $69.00 | 12-month: $5.83/mo |',
      '| STREAMB4 | N/A | $39.99 | $69.99 | 12-month: $5.83/mo equivalent |'
    );

    // "Month-to-month flexibility available"
    c = c.replace(
      '- From $5.83/month (12-month plan)\n- Month-to-month flexibility available',
      '- From $39.99 for 3 months'
    );

    // "$5.83/month" standalone instances
    c = c.replaceAll('Plans start at just $5.83/month.', 'Plans from $39.99 for 3 months.');
    c = c.replace('Exceptional value starting at $5.83/month', 'Exceptional value — plans from $39.99');
    c = c.replace('starting at just $5.83/month', 'starting at $39.99 for 3 months');
    c = c.replace('from just $5.83/month', 'from $39.99 for 3 months');
    c = c.replace('From $5.83/month (12-month plan)', 'From $39.99 for 3 months');
    // "from $5.83/month" (not already handled above)
    c = c.replace(/from \$5\.83\/month(?! equivalent)/g, 'from $39.99 for 3 months');

    return c;
  });

  // ── POST 8: best-iptv-in-2026-top-iptv-services-compared-for-streaming-sports-4k ──
  await updatePost(col, 'best-iptv-in-2026-top-iptv-services-compared-for-streaming-sports-4k', (c) => {
    // Pricing comparison table
    c = c.replace(
      '| STREAMB4 | $9.00 | $24.00 | $69.00 | 12-month: $5.83/mo |',
      '| STREAMB4 | N/A | $39.99 | $69.99 | 12-month: $5.83/mo equivalent |'
    );

    // "Month-to-month flexibility available"
    c = c.replace(
      '- From $5.83/month (12-month plan)\n- Month-to-month flexibility available',
      '- From $39.99 for 3 months'
    );

    // "$5.83/month" standalone instances
    c = c.replaceAll('Plans start at just $5.83/month.', 'Plans from $39.99 for 3 months.');
    c = c.replace('Exceptional value starting at $5.83/month', 'Exceptional value — plans from $39.99');
    c = c.replace('starting at just $5.83/month', 'starting at $39.99 for 3 months');
    c = c.replace('from just $5.83/month', 'from $39.99 for 3 months');
    c = c.replace('From $5.83/month (12-month plan)', 'From $39.99 for 3 months');
    c = c.replace(/from \$5\.83\/month(?! equivalent)/g, 'from $39.99 for 3 months');
    c = c.replace('STREAMB4 provides comprehensive sports coverage from $5.83/month', 'STREAMB4 provides comprehensive sports coverage from $39.99 for 3 months');
    c = c.replace('best value with comprehensive sports coverage from $5.83/month', 'best value with comprehensive sports coverage from $39.99 for 3 months');

    // Inline old-title link in body (check for this pattern from scan)
    c = c.replace(
      'The [THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      'The [live TV streaming guide](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );

    // iOS app table: article title as cell content
    c = c.replace(
      '| GSE Smart IPTV | [THE COMPLETE BEST IPTV FOR USA 2026 GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-usa-2026)',
      '| GSE Smart IPTV | [Best IPTV for USA 2026](https://streamb4.com/blog/best-iptv-for-usa-2026)'
    );

    // Related Guides ALL-CAPS
    c = c.replace(
      '- [THE COMPLETE BEST IPTV FOR USA 2026 GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/best-iptv-for-usa-2026)',
      '- [Best IPTV for USA 2026 — Complete Guide](https://streamb4.com/blog/best-iptv-for-usa-2026)'
    );
    c = c.replace(
      '- [THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      '- [Live TV Streaming Guide 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );

    return c;
  });

  // ── POST 9: best-sports-iptv-providers-2026 ──────────────────────────────
  await updatePost(col, 'best-sports-iptv-providers-2026', (c) => {
    // Pricing comparison table
    c = c.replace(
      '| STREAMB4 | $9.00 | $24.00 | $69.00 | 12-month: $5.83/mo |',
      '| STREAMB4 | N/A | $39.99 | $69.99 | 12-month: $5.83/mo equivalent |'
    );

    // "Month-to-month flexibility" (slightly different pattern in sports article)
    c = c.replace(
      '- From $5.83/month (12-month plan)\n- No contracts, cancel anytime',
      '- From $39.99 for 3 months\n- No contracts, cancel anytime'
    );

    // "Up to 6 screens" in features comparison table
    c = c.replace('✓ Up to 6 screens', '✓ Up to 3 screens (Family plan)');
    c = c.replace('✓ Up to 6 screens', '✓ Up to 3 screens (Family plan)');

    // Draft link used as "reliable" in intro
    c = c.replace(
      'separate [reliable](/blog/draft-1784162544682) providers from unreliable ones',
      'separate reliable providers from unreliable ones'
    );

    // $5.83 instances
    c = c.replaceAll('Plans start at just $5.83/month.', 'Plans from $39.99 for 3 months.');
    c = c.replace('Exceptional value starting at $5.83/month', 'Exceptional value — plans from $39.99');
    c = c.replace('starting at just $5.83/month', 'starting at $39.99 for 3 months');
    c = c.replace('starting at $5.83/month', 'starting at $39.99 for 3 months');
    c = c.replace('from just $5.83/month', 'from $39.99 for 3 months');
    c = c.replace('From $5.83/month (12-month plan)', 'From $39.99 for 3 months');
    c = c.replace('| From $5.83/mo |', '| From $39.99/3mo |');
    c = c.replace(/from \$5\.83\/month(?! equivalent)/g, 'from $39.99 for 3 months');

    // Inline old-title link
    c = c.replace(
      '[THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      '[live TV streaming guide](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );

    // Related Guides ALL-CAPS (catch any remaining)
    c = c.replace(
      '- [THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      '- [Live TV Streaming Guide 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );

    return c;
  });

  // ── POST 10: the-complete-world-cup-2026-streaming-guide ──────────────────
  await updatePost(col, 'the-complete-world-cup-2026-streaming-guide-how-to-watch-every-match-live-in-4k', (c) => {
    // CTA pricing
    c = c.replaceAll('Plans start at just $5.83/month.', 'Plans from $39.99 for 3 months.');

    // Comparison table row: "| STREAMB4 | From $5.83/mo |"
    c = c.replace('| STREAMB4 | From $5.83/mo |', '| STREAMB4 | From $39.99/3mo |');

    // "12-month: $5.83/mo" in comparison table (add "equivalent")
    c = c.replace('12-month: $5.83/mo |', '12-month: $5.83/mo equivalent |');

    // Draft link in text
    c = c.replace(
      '[Best Reliable Sports IPTV Providers in 2026 (Complete Comparison)](https://streamb4.com/blog/draft-1784162544682)',
      '[reliable sports IPTV providers](https://streamb4.com/blog/best-sports-iptv-providers-2026)'
    );

    // Inline old-title link
    c = c.replace(
      '[THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      '[live TV streaming guide](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );

    // Related Guides ALL-CAPS (if any)
    c = c.replace(
      '- [THE COMPLETE LIVE TV STREAMING GUIDE GUIDE: EVERYTHING YOU NEED TO KNOW IN 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)',
      '- [Live TV Streaming Guide 2026](https://streamb4.com/blog/the-complete-guide-to-live-tv-streaming-in-2026)'
    );

    // Also fix "How to watch" link text for Apple TV guide (from scan)
    c = c.replace(
      '[How to Watch IPTV on Apple TV (2026): Complete Setup Guide](https://streamb4.com/blog/how-to-watch-iptv-on-apple-tv)',
      '[IPTV on Apple TV — Setup Guide](https://streamb4.com/blog/how-to-watch-iptv-on-apple-tv)'
    );

    return c;
  });

  await client.close();
  console.log('\nAll done!');
}).catch(e => { console.error(e); process.exit(1); });
