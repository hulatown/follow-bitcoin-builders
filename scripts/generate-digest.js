#!/usr/bin/env node

/**
 * Generate a digest from fetched feeds
 *
 * This script prepares content for summarization.
 * When used with Claude Code/OpenClaw, the agent does the summarization.
 * No external LLM API key required.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = path.join(__dirname, '..', 'prompts');
const OUTPUT_DIR = path.join(__dirname, '..', 'examples');

async function loadPrompt(name) {
  const filePath = path.join(PROMPTS_DIR, `summarize-${name}.md`);
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

async function prepareDigest(feedsPath) {
  console.log(`Preparing digest from ${feedsPath}...`);

  const feedsContent = await fs.readFile(feedsPath, 'utf-8');
  const feeds = JSON.parse(feedsContent);

  const date = new Date().toISOString().split('T')[0];

  // Prepare content for the agent to summarize
  const digest = {
    date,
    generatedAt: new Date().toISOString(),
    prompts: {},
    content: {}
  };

  // Load prompts
  digest.prompts.tweets = await loadPrompt('tweets');
  digest.prompts.blogs = await loadPrompt('blogs');
  digest.prompts.newsletters = await loadPrompt('newsletters');
  digest.prompts.forums = await loadPrompt('forums');

  // Include raw content for agent to process
  if (feeds.x) {
    digest.content.x = feeds.x;
  }
  if (feeds.blogs) {
    digest.content.blogs = feeds.blogs;
  }
  if (feeds.newsletters) {
    digest.content.newsletters = feeds.newsletters;
  }
  if (feeds.forums) {
    digest.content.forums = feeds.forums;
  }

  // Stats
  digest.stats = {
    tweets: feeds.x?.tweets?.length || 0,
    accounts: feeds.x?.accounts?.length || 0,
    blogs: feeds.blogs?.length || 0,
    newsletters: feeds.newsletters?.length || 0,
    forums: feeds.forums?.length || 0
  };

  // Output as JSON for the agent to consume
  const outputPath = path.join(OUTPUT_DIR, `digest-input-${date}.json`);
  await fs.writeFile(outputPath, JSON.stringify(digest, null, 2));

  console.log(`Digest input saved to ${outputPath}`);
  console.log(`Stats: ${JSON.stringify(digest.stats)}`);

  // Also output to stdout for piping
  console.log('\n--- DIGEST CONTENT ---\n');
  console.log(JSON.stringify(digest, null, 2));

  return digest;
}

async function main() {
  // Find the most recent feeds file
  try {
    const files = await fs.readdir(OUTPUT_DIR);
    const feedFiles = files.filter(f => f.startsWith('feeds-') && f.endsWith('.json'));

    if (feedFiles.length === 0) {
      console.error('No feeds file found. Run fetch-feeds.js first.');
      process.exit(1);
    }

    const latestFeeds = feedFiles.sort().pop();
    const feedsPath = path.join(OUTPUT_DIR, latestFeeds);

    await prepareDigest(feedsPath);
  } catch (error) {
    console.error('Error preparing digest:', error);
    process.exit(1);
  }
}

main();
