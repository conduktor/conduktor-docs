---
date: 2025-03-24
title: Hotfix for Console 1.32.1
description: docker pull conduktor/conduktor-console:1.32.1
solutions: console
tags: fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*

### Fixes
- Fixed dependencies vulnerable to the following CVEs:
  - [CVE-2025-22228](https://nvd.nist.gov/vuln/detail/CVE-2025-22228)
  - [CVE-2025-30204](https://nvd.nist.gov/vuln/detail/CVE-2025-30204)
- Fixed an issue where web browsers would try to autofill Kafka Connect configuration form fields with saved passwords
