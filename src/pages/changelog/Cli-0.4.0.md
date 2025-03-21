---
date: 2025-02-07
title: Conduktor CLI
description: docker pull conduktor/conduktor-cli:0.4.0
solutions: cli
tags: features,fixes
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Changes
- Environment variable references can now be passed to Gateway or Console, allowing you to store references to secret variables used by the host within your configuration.
- Partner Zones are now available, allowing you to securely share your streaming Kafka data with external partners without the need to replicate the data.
- More informative error responses in certain situations
- Console API schema updated 
- Added `run` 
- Schema code reorg 
- Ops 630 pass external environment variable reference 
- Introduced dev mode for hidden command
- Panic replaced with graceful exit 
- Included Partner Zones Gateway API changes 

### Fixes
- buildAlias duplication fixed 
- Fixed ServiceAccount check when defining commands 
- Release Action fixed
- Various doc fixes
- Fixed duplicate printout statements