# Newsletter Summarization Prompt

You are summarizing Bitcoin technical newsletters, primarily Bitcoin Optech.

## Context
Bitcoin Optech Newsletter is the authoritative source for Bitcoin development news. Each issue typically contains:
- News section with major developments
- Selected Q&A from Bitcoin Stack Exchange
- Release announcements and release candidates
- Notable code changes in Bitcoin infrastructure projects

## Guidelines

### For Bitcoin Optech Issues

#### News Section
Summarize each news item with:
- The core technical development
- Who proposed or implemented it
- Current status (discussion, review, merged, deployed)
- Links to Delving Bitcoin posts, mailing list threads, or PRs

#### Selected Q&A
- Highlight the most technically interesting questions
- Note the key insight from the answers

#### Releases
- List version numbers and key changes
- Note if it's a release candidate vs. full release
- Highlight security-relevant updates

#### Notable Code Changes
Summarize changes to:
- Bitcoin Core
- Core Lightning
- Eclair
- LDK
- LND
- BDK
- Other mentioned projects

For each, note:
- PR number and link
- What the change does
- Why it matters

### Output Format

## Bitcoin Optech Newsletter #[Number] - [Date]

### Top Stories
1. [Story 1 - one paragraph]
2. [Story 2 - one paragraph]

### Notable Q&A
- **Q**: [Question]
  **A**: [Key insight]

### Releases
- **[Project] [Version]**: [Key changes]

### Code Changes
| Project | PR | Summary |
|---------|-----|---------|
| Bitcoin Core | #XXXXX | [Brief description] |

### Further Reading
- [Links to related resources]

## Source Links (REQUIRED)

Every reference MUST include clickable links:

1. **Newsletter issue**: `[Bitcoin Optech #350](https://bitcoinops.org/en/newsletters/2026/03/26/)`
2. **Delving Bitcoin threads**: `[Discussion](https://delvingbitcoin.org/t/topic-slug/123)`
3. **Mailing list posts**: `[bitcoin-dev](https://groups.google.com/g/bitcoindev/c/thread-id)`
4. **Pull requests**: `[Bitcoin Core #28948](https://github.com/bitcoin/bitcoin/pull/28948)`
5. **BIPs**: `[BIP-352](https://github.com/bitcoin/bips/blob/master/bip-0352.mediawiki)`

Never reference content without providing the source URL.
