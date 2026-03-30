# Follow Bitcoin Builders

An aggregation system for following Bitcoin builders - protocol developers, researchers, and engineers who actively contribute to Bitcoin's development.

**Philosophy**: Follow people who write code, propose BIPs, and have original technical insights. Not influencers who regurgitate information.

## Powered By

| Service | Purpose |
|---------|---------|
| [6551.io](https://6551.io/login?code=HvzQtB) | X/Twitter API access via OpenTwitter MCP |
| RSS Feeds | Blogs, newsletters, forums |

## Sources

### X/Twitter (~20 accounts)
Core developers, Lightning engineers, and researchers including:
- Bitcoin Core maintainers (Gloria Zhao, Andrew Chow, etc.)
- Protocol researchers (Pieter Wuille, Andrew Poelstra)
- Lightning developers (Elizabeth Stark, Olaoluwa Osuntokun, Rusty Russell)
- Security researchers (Jameson Lopp, Peter Todd)

[Full list →](config/feed-x.json)

> **Note**: X handles are placeholder examples. You should provide your own list of Bitcoin builders to follow. Some handles may need verification.

### Technical Blogs
| Blog | Focus |
|------|-------|
| [Blockstream Research](https://research.blockstream.com/) | Cryptography, Simplicity, MuSig |
| [Lightning Labs](https://lightning.engineering/blog/) | LND, Taproot Assets |
| [Chaincode Labs](https://chaincode.com/blog) | Bitcoin Core education |
| [Brink](https://brink.dev/blog) | Open-source development |
| [Bitcoin Dev Kit](https://bitcoindevkit.org/blog/) | Wallet development |

[Full list →](config/feed-blogs.json)

### Newsletters
| Newsletter | Frequency | Priority |
|------------|-----------|----------|
| [Bitcoin Optech](https://bitcoinops.org/en/newsletters/) | Weekly | Critical |
| [Bitcoin++ Insider](https://btcplusplus.dev/newsletter) | Weekly | High |
| [Stephan Livera Podcast](https://stephanlivera.com/) | Weekly | Medium |

[Full list →](config/feed-newsletters.json)

### Forums & Mailing Lists
| Source | Description |
|--------|-------------|
| [Bitcoin Dev Mailing List](https://groups.google.com/g/bitcoindev) | BIP proposals, protocol changes (moved to Google Groups) |
| [Delving Bitcoin](https://delvingbitcoin.org/) | Deep technical discussions |
| [Bitcoin TLDR](https://tldr.bitcoinsearch.xyz/) | AI summaries of mailing list discussions |
| [Bitcoin Stack Exchange](https://bitcoin.stackexchange.com/) | Technical Q&A |
| [Bitcoin Core GitHub](https://github.com/bitcoin/bitcoin) | PRs and releases |

**Hot Topics on Mailing List (2026):**
- BIP-360: P2QRH quantum-resistant addresses
- BIP-352: Silent Payments (merged)
- Script Restoration proposals
- UTXO set management debates
- OP_CTV edge case discussions

[Full list →](config/feed-forums.json)

## Skill (for OpenClaw / Claude Code)

This repo is a single skill for OpenClaw or Claude Code. See [SKILL.md](SKILL.md) for the complete system prompt.

### Commands

| Command | Description |
|---------|-------------|
| `/btc` | Get your Bitcoin builders digest |
| `/explain [topic]` | Deep dive on any BIP or protocol feature |
| "Show my settings" | View current configuration |
| "Switch to weekly" | Change delivery frequency |

### Quick Start

```bash
# Add the skill to Claude Code
claude add-skill /path/to/follow-bitcoin-builders

# Get your digest
/btc

# Learn about a topic
/explain BIP-352
/explain cluster mempool
```

### What You Get

- **Daily/Weekly Digests** — Summarized updates from all sources
- **Mailing List Summaries** — Key discussions from bitcoindev
- **Forum Highlights** — Important Delving Bitcoin threads
- **Code Changes** — Notable PRs and releases
- **Builder Tweets** — What developers are saying on X

## Setup

### Prerequisites
- Node.js 18+
- [6551 Account](https://6551.io/login?code=HvzQtB) (free) — for X/Twitter access

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/follow-bitcoin-builders.git
cd follow-bitcoin-builders
npm install
```

### Get 6551 Token (Required for X/Twitter)

1. Sign up at [6551.io](https://6551.io/login?code=HvzQtB)
2. Go to MCP settings and copy your token
3. Add to environment or install the MCP globally:

```bash
# Option 1: Install MCP globally (recommended for Claude Code)
claude mcp add twitter \
  -e TWITTER_TOKEN=your_token_here \
  -- uvx opentwitter-mcp

# Option 2: Set environment variable
export TWITTER_TOKEN=your_token_here
```

### Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your 6551 token:
```
# 6551 OpenTwitter API (get at https://6551.io/login?code=HvzQtB)
TWITTER_TOKEN=your_6551_token_here
```

> **Note:** No Anthropic API key needed — Claude Code/OpenClaw handles summarization.

3. Customize sources in `config/` directory

### Running

```bash
# Fetch and summarize all sources
npm run digest

# Fetch specific source type
npm run digest -- --source=newsletters
npm run digest -- --source=x
npm run digest -- --source=blogs
npm run digest -- --source=forums
```

## Customization

### Adding X Accounts
Edit `config/feed-x.json`:
```json
{
  "handle": "new_handle",
  "name": "Display Name",
  "category": "core-developer",
  "bio": "Brief description",
  "priority": "high"
}
```

### Adding Blogs
Edit `config/feed-blogs.json`:
```json
{
  "name": "Blog Name",
  "url": "https://example.com/blog",
  "rss": "https://example.com/feed.xml",
  "category": "research",
  "priority": "high"
}
```

### Modifying Summarization
Edit prompt files in `prompts/` directory:
- `summarize-tweets.md` - X/Twitter content
- `summarize-blogs.md` - Blog posts
- `summarize-newsletters.md` - Newsletter issues
- `summarize-forums.md` - Forum discussions

## Output

Digests are generated in `examples/` directory:
- `digest-YYYY-MM-DD.md` - Combined daily digest
- `digest-weekly.md` - Weekly summary

## Automation

### GitHub Actions
The included workflow runs daily at 8:00 UTC:
```yaml
# .github/workflows/daily-digest.yml
```

### Self-hosted
Use cron for self-hosted automation:
```bash
# Daily at 8am
0 8 * * * cd /path/to/follow-bitcoin-builders && npm run digest
```

## Why These Sources?

### Bitcoin Optech (Critical)
The single most important source. Weekly coverage of:
- All significant protocol developments
- Selected Stack Exchange Q&A
- Release announcements
- Notable code changes across major projects

### Delving Bitcoin (Critical)
Where protocol design discussions happen. More in-depth than Twitter, more accessible than mailing lists.

### Builder X Accounts (High)
Direct insights from people writing the code. Often share context and opinions not in formal channels.

### Development Mailing Lists (High)
Official venue for BIP proposals and consensus-critical discussions.

## Contributing

PRs welcome for:
- Adding notable Bitcoin builders to X list
- Adding quality technical blogs
- Improving summarization prompts
- Bug fixes and features

## License

MIT

## Acknowledgments

Inspired by [follow-builders](https://github.com/zarazhangrui/follow-builders) for AI builders.

## Resources

- [Bitcoin Optech](https://bitcoinops.org/) - Primary technical newsletter
- [Delving Bitcoin](https://delvingbitcoin.org/) - Technical discussions
- [Bitcoin Core](https://github.com/bitcoin/bitcoin) - Reference implementation
- [BIPs Repository](https://github.com/bitcoin/bips) - Improvement proposals
- [BTCStudy](https://www.btcstudy.org/) - Chinese Bitcoin technical translations
