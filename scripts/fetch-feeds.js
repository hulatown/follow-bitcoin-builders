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
 *
 * All endpoints use POST with JSON body
 */
async function fetchTwitterUser(username) {
  if (!TWITTER_TOKEN) {
    throw new Error('TWITTER_TOKEN not set. Get one at https://6551.io/login?code=HvzQtB');
  }

  const response = await fetch(`${TWITTER_API_BASE}/open/twitter_user_info`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TWITTER_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch user ${username}: ${response.status} ${text}`);
  }

  return response.json();
}

async function fetchUserTweets(username, maxResults = 20) {
  if (!TWITTER_TOKEN) {
    throw new Error('TWITTER_TOKEN not set. Get one at https://6551.io/login?code=HvzQtB');
  }

  const response = await fetch(`${TWITTER_API_BASE}/open/twitter_user_tweets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TWITTER_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      maxResults,
      product: 'Latest'
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch tweets for ${username}: ${response.status} ${text}`);
  }

  return response.json();
}

async function searchTwitter(query, options = {}) {
  if (!TWITTER_TOKEN) {
    throw new Error('TWITTER_TOKEN not set. Get one at https://6551.io/login?code=HvzQtB');
  }

  const response = await fetch(`${TWITTER_API_BASE}/open/twitter_search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TWITTER_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      product: options.product || 'Latest',
      maxResults: options.maxResults || 50,
      ...options
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Twitter search failed: ${response.status} ${text}`);
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

  // Fetch from all accounts in the config
  const allHandles = config.accounts.map(a => a.handle || a);

  for (const handle of allHandles) {
    try {
      console.log(`  Fetching @${handle}...`);
      const user = await fetchTwitterUser(handle);
      if (user) {
        const tweets = await fetchUserTweets(handle, 10);
        results.accounts.push({
          handle,
          name: user.name || user.screen_name,
          bio: user.description,
          followers: user.followers_count
        });
        if (tweets?.data || tweets?.tweets) {
          const tweetList = tweets.data || tweets.tweets || [];
          results.tweets.push(...tweetList.map(t => ({
            ...t,
            handle,
            author: user.name || user.screen_name
          })));
        }
        results.stats.fetched++;
      }
    } catch (error) {
      console.error(`  Error fetching @${handle}: ${error.message}`);
      results.stats.errors++;
    }
    // Rate limiting
    await new Promise(r => setTimeout(r, 300));
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
