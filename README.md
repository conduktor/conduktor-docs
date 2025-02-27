- [Conduktor technical docs](#conduktor-technical-docs)
- [Deployment and structure](#deployment-notes)
- [Docs best practice](#docs-best-practice)
  - [Images](#images)
  - [Links](#links)
  - [Tabs](#tabs)
  - [Tags](#tags)
- [Update release notes](#update-release-notes)
- [Update public API docs](#update-public-api-docs)

# Conduktor technical docs
Production is on `main`: [https://docs.conduktor.io](https://docs.conduktor.io).

# Deployment and structure
In most cases, you'll be editing Markdown files in the **docs** directory, for either Console (**docs/platform**) or Gateway (**docs/gateway**). 

For a local preview (on *localhost:3000*), run `yarn start`. 

If you're editing many files or making significant changes, run `yarn build` to check for any failures before merging:

```
$ yarn
$ yarn start
$ yarn build
```

We're using [Vercel](https://vercel.com/) for hosting and the build will try to deploy to this platform.

# Docs best practice
## Images
Add images to the **assets** folder under the same directory as the Markdown file you're editing. Use `![Image description](assets/image.png)`.

All images will be auto-sized to fit the width of the content pane. 

To resize an image:

```md
import MyImage from './assets/my-image.png';

<img src={MyImage} alt="My Image" style={{ width: 400, display: 'block', margin: 'auto' }} />
```

## Links
Use absolute links when linking to Conduktor docs, e.g. **[hardware specs](/platform/get-started/installation/hardware)**.

You can also link to specific sections on the page, e.g. **[export properties](/platform/get-started/configuration/env-variables/#auditlog-export-properties)**.

## Tabs
You can break-up long paragraphs by using tabs, [like this](/platform/get-started/configuration/user-authentication/SSO/azure/#console-configuration). 

To add tabs:

````md
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

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

## Tags
You can use tags to visualize available options, [like this](/platform/reference/resource-reference/self-service/). 

To add tags:

```md
import Admonition from '@theme/Admonition';

export const Highlight = ({children, color, text}) => (
<span style={{ backgroundColor: color, borderRadius: '4px', color: text, padding: '0.2rem 0.5rem', fontWeight: '500' }}> {children} </span>
);

export const Tag1 = () => (
<Highlight color="#F8F1EE" text="#7D5E54">Tag 1</Highlight>
);

<Tag1/>
```

# Update release notes
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

# Update public API docs
API docs live on *host:8888* of the deployed Gateway/Console and are also published to: [Gateway API docs](https://developers.conduktor.io/?product=gateway) and [Console API docs](https://developers.conduktor.io/?product=console).

To update the public docs:
1. Copy the latest open API yaml files from the `conduktor-proxy` repo based on the version:
- [Gateway v1](https://github.com/conduktor/conduktor-proxy/blob/main/proxy/src/main/resources/gateway-API.yaml)
- [Gateway v2](https://github.com/conduktor/conduktor-proxy/blob/main/api-definition/src/main/resources/openapi.yaml)
- [Console](https://github.com/conduktor/console-plus/blob/main/modules/consoleplus/app/src/main/resources/public-api-doc.yaml)
1. Paste the yaml files to [/static/developers](./static/developers/openapi/gateway) and rename as required.
1. Add the new version to `static/developers/openapi/manifest.json`.