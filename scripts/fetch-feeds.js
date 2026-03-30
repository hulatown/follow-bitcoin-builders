#!/usr/bin/env node

/**
 * Fetch feeds from all configured sources
 *
 * X/Twitter: Uses 6551 OpenTwitter MCP (requires TWITTER_TOKEN)
 * Other sources: Uses RSS feeds
 *
 * Usage: node scripts/fetch-feeds.js [--source=x|blogs|newsletters|forums|all]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_DIR = path.join(__dirname, '..', 'config');
const OUTPUT_DIR = path.join(__dirname, '..', 'examples');

// 6551 OpenTwitter API configuration
const TWITTER_API_BASE = process.env.TWITTER_API_BASE || 'https://ai.6551.io';
const TWITTER_TOKEN = process.env.TWITTER_TOKEN;

// Parse command line arguments
const args = process.argv.slice(2);
const sourceArg = args.find(a => a.startsWith('--source='));
const source = sourceArg ? sourceArg.split('=')[1] : 'all';

async function loadConfig(name) {
  const filePath = path.join(CONFIG_DIR, `feed-${name}.json`);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

async function fetchRSS(url) {
  console.log(`Fetching RSS: ${url}`);
  try {
    const response = await fetch(url);
    const text = await response.text();
    return { success: true, content: text };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch tweets using 6551 OpenTwitter API
 * Docs: https://github.com/6551Team/opentwitter-mcp
 * Get token: https://6551.io/login?code=HvzQtB
 */
async function fetchTwitterUser(handle) {
  if (!TWITTER_TOKEN) {
    throw new Error('TWITTER_TOKEN not set. Get one at https://6551.io/login?code=HvzQtB');
  }

  const response = await fetch(`${TWITTER_API_BASE}/open/twitter/user_by_username/${handle}`, {
    headers: {
      'Authorization': `Bearer ${TWITTER_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user ${handle}: ${response.status}`);
  }

  return response.json();
}

async function fetchUserTweets(userId, count = 20) {
  if (!TWITTER_TOKEN) {
    throw new Error('TWITTER_TOKEN not set. Get one at https://6551.io/login?code=HvzQtB');
  }

  const response = await fetch(`${TWITTER_API_BASE}/open/twitter/user_tweets/${userId}?count=${count}`, {
    headers: {
      'Authorization': `Bearer ${TWITTER_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tweets for ${userId}: ${response.status}`);
  }

  return response.json();
}

async function searchTwitter(query, options = {}) {
  if (!TWITTER_TOKEN) {
    throw new Error('TWITTER_TOKEN not set. Get one at https://6551.io/login?code=HvzQtB');
  }

  const params = new URLSearchParams({
    query,
    product: options.product || 'Latest',
    count: options.count || 50,
    ...options
  });

  const response = await fetch(`${TWITTER_API_BASE}/open/twitter/search?${params}`, {
    headers: {
      'Authorization': `Bearer ${TWITTER_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Twitter search failed: ${response.status}`);
  }

  return response.json();
}

async function fetchX() {
  const config = await loadConfig('x');
  const results = {
    accounts: [],
    tweets: [],
    stats: { fetched: 0, errors: 0 }
  };

  if (!TWITTER_TOKEN) {
    console.warn('TWITTER_TOKEN not set. Skipping X/Twitter fetch.');
    console.warn('Get a token at: https://6551.io/login?code=HvzQtB');
    return results;
  }

  console.log(`Fetching tweets from ${config.accounts.length} Bitcoin builders...`);

  // Fetch from notable builders first (higher priority)
  const priorityHandles = [
    ...config.notable_builders?.core_maintainers || [],
    ...config.notable_builders?.lightning || [],
    ...config.notable_builders?.research || []
  ];

  for (const handle of priorityHandles.slice(0, 20)) {
    try {
      console.log(`  Fetching @${handle}...`);
      const user = await fetchTwitterUser(handle);
      if (user?.id) {
        const tweets = await fetchUserTweets(user.id, 10);
        results.accounts.push({
          handle,
          name: user.name,
          bio: user.description,
          followers: user.followers_count
        });
        if (tweets?.tweets) {
          results.tweets.push(...tweets.tweets.map(t => ({
            ...t,
            handle,
            author: user.name
          })));
        }
        results.stats.fetched++;
      }
    } catch (error) {
      console.error(`  Error fetching @${handle}: ${error.message}`);
      results.stats.errors++;
    }
    // Rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  return results;
}

async function fetchBlogs() {
  const config = await loadConfig('blogs');
  const results = [];

  for (const blog of config.blogs) {
    if (blog.rss) {
      const feed = await fetchRSS(blog.rss);
      results.push({
        name: blog.name,
        url: blog.url,
        filter: blog.filter,
        ...feed
      });
    }
  }

  return results;
}

async function fetchNewsletters() {
  const config = await loadConfig('newsletters');
  const results = [];

  for (const newsletter of config.newsletters) {
    if (newsletter.rss) {
      const feed = await fetchRSS(newsletter.rss);
      results.push({
        name: newsletter.name,
        url: newsletter.url,
        ...feed
      });
    }
  }

  return results;
}

async function fetchForums() {
  const config = await loadConfig('forums');
  const results = [];

  for (const forum of config.forums) {
    if (forum.rss) {
      const feed = await fetchRSS(forum.rss);
      results.push({
        name: forum.name,
        url: forum.url,
        ...feed
      });
    }
  }

  return results;
}

async function main() {
  console.log(`\n=== Bitcoin Builders Feed Fetcher ===`);
  console.log(`Source: ${source}`);
  console.log(`6551 API: ${TWITTER_TOKEN ? 'Configured ✓' : 'Not configured (X/Twitter will be skipped)'}\n`);

  const results = {
    generatedAt: new Date().toISOString(),
    source: source,
    twitter_powered_by: '6551.io'
  };

  try {
    if (source === 'all' || source === 'x') {
      console.log('--- Fetching X/Twitter ---');
      results.x = await fetchX();
      console.log(`  Fetched ${results.x.stats?.fetched || 0} accounts\n`);
    }

    if (source === 'all' || source === 'blogs') {
      console.log('--- Fetching Blogs ---');
      results.blogs = await fetchBlogs();
      console.log(`  Fetched ${results.blogs.length} blog feeds\n`);
    }

    if (source === 'all' || source === 'newsletters') {
      console.log('--- Fetching Newsletters ---');
      results.newsletters = await fetchNewsletters();
      console.log(`  Fetched ${results.newsletters.length} newsletter feeds\n`);
    }

    if (source === 'all' || source === 'forums') {
      console.log('--- Fetching Forums ---');
      results.forums = await fetchForums();
      console.log(`  Fetched ${results.forums.length} forum feeds\n`);
    }

    // Save raw feeds
    const outputPath = path.join(OUTPUT_DIR, `feeds-${new Date().toISOString().split('T')[0]}.json`);
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

    console.log(`=== Complete ===`);
    console.log(`Feeds saved to ${outputPath}\n`);
    return results;

  } catch (error) {
    console.error('Error fetching feeds:', error);
    process.exit(1);
  }
}

main();
