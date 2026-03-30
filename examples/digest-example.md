# Bitcoin Builders Digest - 2026-03-30

*Generated at 2026-03-30T12:00:00.000Z*

---

## Builder Tweets

### Protocol Development

**Pieter Wuille (@pwuille)**
> Shared insights on the ongoing cluster mempool implementation work. Notes that the current approach simplifies fee estimation and enables more efficient block template construction.

Key points:
- Cluster mempool groups related transactions
- Enables ancestor-aware fee estimation
- Significant performance improvements in template building

[Link to thread](https://x.com/pwuille/status/example)

---

**Gloria Zhao (@glozow)**
> Announced new package relay improvements landing in Bitcoin Core 28.0. Package RBF rules are now more intuitive for wallet developers.

Key points:
- Package RBF simplification
- Better documentation for wallet implementers
- Improved test coverage for edge cases

[Link to thread](https://x.com/glozow/status/example)

---

### Lightning Network

**Olaoluwa Osuntokun (@roasbeef)**
> LND v0.19 beta focuses on stability and performance. New features include improved HTLC handling and better pathfinding for large payments.

Key points:
- 20% improvement in pathfinding speed
- New experimental MPP splitting algorithm
- Taproot Assets daemon integration progress

[Link to thread](https://x.com/roasbeef/status/example)

---

### Research

**Robin Linus (@robin_linus)**
> Published new paper on BitVM improvements. The garbled circuit optimization reduces verification costs significantly.

Key points:
- 40% reduction in script size
- Compatible with existing BitVM implementations
- Opens possibilities for more complex computations

[Link to post](https://x.com/robin_linus/status/example)

---

## Technical Blogs

### Blockstream Research - DahLIAS: Cross-Input Signature Aggregation

**Source**: Blockstream Research
**Date**: 2026-03-28

Blockstream Research announced DahLIAS, the first cryptographic protocol enabling full cross-input signature aggregation using Bitcoin's native secp256k1 curve. This breakthrough introduces 64-byte aggregate signatures with a two-round signing protocol.

Key Technical Points:
- Works with existing secp256k1 curve (no new cryptographic assumptions)
- Two-round signing protocol (comparable to MuSig2)
- Potential for significant transaction size reduction
- Maintains compatibility with existing Schnorr signature verification

Relevance:
- Wallet developers: Reduced transaction fees for multi-input transactions
- Node operators: More efficient block validation
- Protocol researchers: Foundation for future scaling improvements

[Read full post](https://research.blockstream.com/example)

---

### Lightning Labs - Taproot Assets Mainnet Progress

**Source**: Lightning Labs Blog
**Date**: 2026-03-27

Lightning Labs provided an update on Taproot Assets daemon development. The mainnet alpha now supports full asset lifecycle management including minting, transferring, and burning.

Key Technical Points:
- Complete asset issuance workflow
- Multi-hop Lightning transfers for assets
- Universe sync improvements for asset discovery
- Enhanced proof verification

[Read full post](https://lightning.engineering/blog/example)

---

## Newsletters

## Bitcoin Optech Newsletter #392 - March 27, 2026

### Top Stories

1. **Cluster Mempool Soft Launch**: Bitcoin Core developers have begun gradual rollout of cluster mempool features. Initial testing shows 15% improvement in block template construction time with no consensus changes required.

2. **New BIP for Ark Protocol**: A draft BIP was submitted for the Ark off-chain payment protocol, enabling instant payments with improved privacy properties over standard Lightning channels.

### Notable Q&A

- **Q**: How does package relay affect Replace-By-Fee?
  **A**: Package relay enables child-pays-for-parent across multiple unconfirmed transactions, making fee bumping more predictable.

- **Q**: What are the security considerations for Taproot Assets?
  **A**: Assets inherit Bitcoin's security model, with additional considerations for asset metadata integrity and proof verification.

### Releases

- **Bitcoin Core 28.0rc1**: First release candidate with cluster mempool, improved fee estimation, and better P2P performance
- **LND v0.19.0-beta**: Stability improvements, new MPP algorithm, TAP integration
- **Core Lightning v25.02**: Enhanced BOLT12 support, improved channel rebalancing

### Code Changes

| Project | PR | Summary |
|---------|-----|---------|
| Bitcoin Core | #29001 | Implement cluster linearization for mempool |
| Bitcoin Core | #28950 | Add package RBF support |
| LND | #8234 | Improve MPP payment splitting |
| Core Lightning | #7012 | BOLT12 recurrence support |
| LDK | #2890 | Add async payment support |

### Further Reading

- [Cluster Mempool Explainer](https://bitcoinops.org/en/topics/cluster-mempool/)
- [Ark Protocol Draft](https://github.com/ark-network/ark)

---

## Forum Discussions

### Delving Bitcoin: Quantum Computing Timeline and Bitcoin Security

**Topic**: Assessing risks from quantum computers to Bitcoin
**Forum**: Delving Bitcoin
**Category**: Protocol Design
**Started by**: Clara Shikhelman
**Date**: 2026-03-25

Summary:
Discussion of a new research report analyzing when quantum computers might pose a realistic threat to Bitcoin's cryptographic assumptions. The report suggests practical attacks remain 15-20 years away, but recommends beginning migration planning.

Key Participants & Positions:
- **Clara Shikhelman**: Presented research summary, advocates for proactive planning
- **Andrew Poelstra**: Notes that Taproot provides some flexibility for future upgrades
- **Peter Todd**: Argues for prioritizing other security improvements first

Technical Details:
- Current quantum computers: ~1,000 qubits
- Estimated requirement for ECDSA break: ~4,000 logical qubits
- Post-quantum signature schemes add significant transaction size

Current Status:
Ongoing discussion. No consensus on timeline but general agreement that monitoring is warranted.

[Link to discussion](https://delvingbitcoin.org/t/example)

---

### Delving Bitcoin: LN-Symmetry Implementation Progress

**Topic**: Updates on eltoo/LN-Symmetry channel type
**Forum**: Delving Bitcoin
**Category**: Implementation
**Started by**: instagibbs
**Date**: 2026-03-26

Summary:
Progress update on implementing LN-Symmetry (formerly eltoo) using APO-like sighash flags. The prototype now handles the full channel lifecycle including cooperative and unilateral closes.

Key Technical Points:
- Uses SIGHASH_ANYPREVOUT (proposed BIP-118)
- Eliminates need for penalty transactions
- Simplifies watchtower requirements
- Compatible with existing Lightning infrastructure

[Link to discussion](https://delvingbitcoin.org/t/example)

---

## Sources

- [Bitcoin Optech](https://bitcoinops.org/)
- [Delving Bitcoin](https://delvingbitcoin.org/)
- [Blockstream Research](https://research.blockstream.com/)
- [Lightning Labs](https://lightning.engineering/)
