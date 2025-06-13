# Conduktor technical docs

- [Deployment and structure](#deployment-and-structure)
- [Docs guidelines](#best-practice-guidelines)
  - [Structure](#structure)
  - [Images](#images)
  - [Links](#links)
  - [Tabs](#tabs)
  - [Dropdowns](#dropdowns)
  - [Labels](#labels)
  - [Glossary](#glossary)
  - [Re-use of content](#re-use-of-content)
    - [Preview functionality](#preview-functionality)
    - [Product availability](#available-in-product-name)
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

We're using [Vercel](https://vercel.com/) for hosting and the build will try to deploy to this platform.

## Best practice guidelines

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

All images are stored in `src/static/guide`. Embed all images like this:

```md
![Internal load balancing diagram](/guide/internal-lb.png)
```

Note that all images will have a defined styling applied but you can override this when required.

To resize an image:

```md
Make it smaller
<img src="/guide/slack-invite.png" alt="Slack" style={{maxWidth: '30%'}} />

Make it larger
<img src="/guide/slack-invite.png" alt="Slack" style={{maxWidth: '90%'}} />

Set a specific pixel width
<img src="/guide/slack-invite.png" alt="Slack" style={{maxWidth: '400px'}} />

Make it full width:
<img src="/guide/slack-invite.png" alt="Slack" style={{maxWidth: '100%'}} />
```

You can also make an image clickable (and open in another tab) - useful for detailed diagrams:

```md
<a href="/guide/internal-lb.png" target="_blank" rel="noopener">
  <img src="/guide/internal-lb.png" alt="Internal load balancing diagram" />
</a>
```

### Links

Use absolute links when linking to Conduktor docs, e.g. */guide/get-started/hardware/*.

You can also link to a specific section on a page, e.g. */guide/get-started/hardware/#hardware-requirements*.

### Tabs

Use tabs to break-up long paragraphs or provide options, [like this](https://docs.conduktor.io/platform/navigation/partner-zones/#create-a-partner-zone). 

To add tabs, add the following:

````md
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="First Tab" label="First Tab">

My first tab content:

```yaml title="first-tab.yaml"
myFirstTab: "content"
```

</TabItem>
<TabItem value="Second Tab" label="Second Tab">

My second tab content:

```yaml title="second-tab.yaml"
mySecondTab: "content"
```
</TabItem>
</Tabs>
````

### Dropdowns

Use these collapsible dropdowns for troubleshooting sections or other Q&A type content.

<details>
  <summary>Question?</summary>
  <d>Answer has to be in the same block of text due to HTML limitations in Markdown.</p>
</details>

#### Make code copyable

import CopyableCode from '@site/src/components/CopyableCode';

<details>
  <summary>How do I handle headers with dashes?</summary>
  <p>
  Use bracket notation instead of dot notation. For example: <CopyableCode language="bash">{`headers['Content-Type']`}</CopyableCode>
  </p>
</details>

### Labels

Use labels to visualize available options, [like these resources](https://docs.conduktor.io/platform/reference/resource-reference/kafka/).

To add labels:

```md
import Label from '@site/src/components/Labels';

This resource can be managed using <Label type="UI" />, <Label type="CLI" /> and <Label type="API" />.
```

To see all the available labels, go to `/src/components/Labels.js`.

### Glossary

#### Add a tooltip

When first introducing Conduktor terminology (e.g. Chargeback), make that word into a glossary term (will display a tooltip when hovered over and formatted) like this:

```md
Use <GlossaryTerm>Chargeback</GlossaryTerm> to visualize your Kafka costs.
```

#### Add new terms to glossary

If the term isn't defined, you can add it to **src/data/glossary.js**.

❗️ Check that the term doesn't exist first. Duplicate entries will break the build. Add the **singular version of the word**:

```md
  {
    term: "New term",
    tooltip: "This is the concise text that will appear as a tooltip. Limit to max of two sentences and avoid formatting.",
    definition: "This is the full definition of the term. Feel free to format with links etc.",
    slug: "new-term"
  },
```

Note that glossary should pick up all the spelling variations (like capitalization).

### Re-use of content

#### Preview functionality

To add:

```md
import AlertPreview from '@site/src/components/shared/alert-preview.md';

<AlertPreview />
```

#### Available in {product name}

To add:

```md

import ProductTrust from '@site/src/components/shared/product-trust.md';

<ProductTrust />
```

## Update release notes

Every new version of Gateway and Console has to have release notes.

To update release notes:

1. Go to **src/pages/changelog**.
1. Create a new file or copy an existing one and rename it. The name has to be in this format: `<productName>-<versionNumber>.md`.
1. Make sure your file has the following header:

```
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
```
import Console1310 from './changelog/Console-1.31.0.md';
```
1. Finally, add an entry at the top of the page, linking to your file. E.g.:
```
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
