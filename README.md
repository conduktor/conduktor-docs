# Conduktor technical docs

- [Deployment and structure](#deployment-and-structure)
- [Docs guidelines](#best-practice-guidelines)
  - [Structure](#structure)
  - [Images](#images)
  - [Links](#links)
- [Update release notes](#update-release-notes)
- [Update public API docs](#update-public-api-docs)

[![Check Markdown links](https://github.com/conduktor/conduktor-docs/actions/workflows/markdown-links-check.yaml/badge.svg)](https://github.com/conduktor/conduktor-docs/actions/workflows/markdown-links-check.yaml)

## Deployment and structure

Production is on `main`: [https://docs.conduktor.io](https://docs.conduktor.io).

In most cases, you'll be editing Markdown files in the **guide** directory.

For a local preview (on *localhost:3000*), run `yarn start`.

If you're editing many files or making significant changes, run `yarn build` to check for any failures before merging:

```bash
yarn
yarn build
yarn start
```

## Best practice guidelines

[Check out Conduktor terminology, writing and ToV guidelines](https://conduktor.slite.com/api/s/APsVcreNLD8oT9/Technical-content).

### Structure

When creating a new page, use this layout:

- Overview. Introduce the concept and highlight main benefits.
- Prerequisites. List things that have to be done/set up before using.
- Use {feature}. Be clear, succinct and use task-oriented headings.
- Configure {feature}. List available customization options.
- Troubleshoot. Add a question/answer list of potential issues/solutions related to {feature}.
- Related resources. Include links to topics related to the feature. Add this link at the end:
  - [Give us feedback/request a feature](https://conduktor.io/roadmap)

When adding a tutorial (step-by-step guide), use this layout:

- Overview/goal. Introduce the concept and the purpose/goal.
- Context or requirements. Set the scene/list pre-requisites.
- List numbered steps. Use action-oriented headings.
- Expected results. Summarize the outcome(s), if it's more complex than something was 'successfully created/added'.
- Related tutorials. Anything else they could learn that's relevant.
- Related resources. Include links to topics related to the feature. Add these two links at the end:
  - [Learn Apache Kafka](https://learn.conduktor.io/kafka/)
  - [Give us feedback/request a feature](https://conduktor.io/roadmap)

### Images

All images are stored in `/images`. Embed all images like this:

```md
![Internal load balancing diagram](/images/internal-lb.png)
```

Note that all images will have a defined styling applied but you can override this when required.

To resize an image:

```md
Make it smaller
<img src="/images/slack-invite.png" alt="Slack" style={{maxWidth: '30%'}} />

Make it larger
<img src="/images/slack-invite.png" alt="Slack" style={{maxWidth: '90%'}} />

Set a specific pixel width
<img src="/images/slack-invite.png" alt="Slack" style={{maxWidth: '400px'}} />

Make it full width:
<img src="/images/slack-invite.png" alt="Slack" style={{maxWidth: '100%'}} />
```

You can also make an image clickable (and open in another tab) - useful for detailed diagrams:

```md
<a href="/images/internal-lb.png" target="_blank" rel="noopener">
  <img src="/images/internal-lb.png" alt="Internal load balancing diagram" />
</a>
```

### Links

Use absolute links when linking to Conduktor docs, e.g. */guide/get-started/hardware/*.

You can also link to a specific section on a page, e.g. */guide/get-started/hardware/#hardware-requirements*.

## Update release notes

Every new version of Gateway and Console has to have release notes.

To update release notes:

1. Go to **src/pages/changelog**.
1. Create a new file or copy an existing one and rename it. The name has to be in this format: `<productName>-<versionNumber>.md`.
1. Make sure your file has the following header:

```md
---
date: 2025-11-25
title: Chargeback
description: docker pull conduktor/conduktor-console:1.31.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*
```

1. Document all the changes in the release. If it's a major release, consider adding an index/table of contents to make it easier to read.

1. Open `src/pages/changelog.mdx` and import your new file, e.g.:

```md
import Console1310 from './changelog/Console-1.31.0.md';
```

1. Finally, add an entry at the top of the page, linking to your file. E.g.:

```md
## Console 1.131.0
<Console1310 />
---
```

## Update public API docs

API docs live on *host:8888* of the deployed Gateway/Console and are also published to: [Gateway API docs](https://developers.conduktor.io/?product=gateway) and [Console API docs](https://developers.conduktor.io/?product=console).

To update the public docs:

1. Copy the latest open API yaml files from the `conduktor-proxy` repo based on the version:

- [Gateway v1](https://github.com/conduktor/conduktor-proxy/blob/main/proxy/src/main/resources/gateway-API.yaml)
- [Gateway v2](https://github.com/conduktor/conduktor-proxy/blob/main/api-definition/src/main/resources/openapi.yaml)
- [Console](https://github.com/conduktor/console-plus/blob/main/modules/consoleplus/app/src/main/resources/public-api-doc.yaml)

1. Paste the yaml files to [/static/developers](./static/developers/openapi/gateway) and rename as required.
1. Add the new version to `static/developers/openapi/manifest.json`.
