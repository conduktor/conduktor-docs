# Conduktor Docs
Production (main): https://docs.conduktor.io

- [Development](#development)
- [Best practices for writing docs](#best-practices-for-writing-docs)
- [Updating public API docs](#updating-public-api-docs)
  - [Gateway](#gateway)
  - [Console](#console)
- [Updating the Changelog](#updating-the-changelog)
  - [Changes for this version](#changes-for-this-version)
  - [Adding your new changelog file to the index](#adding-your-new-changelog-file-to-the-index)
- [Docusaurus Snippets](#docusaurus-snippets)
  - [Resizing images](#resizing-images)
  - [Create table with multiple tabs](#create-table-with-multiple-tabs)
  - [Use tags](#use-tags)
- [Vercel](#vercel)


# Development
For local preview run `yarn` , `yarn start`, a local server starts on localhost:3000. `yarn build` is best practice to see if any failures, as this is what the remote will check on each commit.
```
$ yarn
$ yarn start
$ yarn build
```

Unless you are making changes to the docs framework or updating the changelog, you should only need to edit the Markdown files in the `docs` directory.

Console documentation is found under the `docs/platform` directory, and Gateway's under the `docs/gateway`. The path of the MD files mirrors that of the website url.

# Best practices for writing docs

- Images can be stored in an `assets` directory in the same folder as the MD file, and referenced with `![Alt text](assets/image.png)`.
- If images are too large, you can resize them following [this section](#resizing-images).
- Use absolute links for internal links, e.g. `[link text](/platform/get-started/installation/hardware)`.
- Anchor example, [env variables](/platform/get-started/configuration/env-variables/#auditlog-export-properties)
- If linking to a category page that doesn't have an index then use `/gateway/category/<category-name>` same for `/console/...`
- Line breaks can be added by trailing a line with a double space

# Updating public API docs

## Gateway
They live on the host:8888 of the deployed Gateway, but we also publish them online at [developers.conduktor.io](https://developers.conduktor.io/?product=gateway).

To update the public version copy the latest open api yaml files from conduktor-proxy repo,
https://github.com/conduktor/conduktor-proxy/blob/main/proxy/src/main/resources/gateway-API.yaml (v1)
and https://github.com/conduktor/conduktor-proxy/blob/main/api-definition/src/main/resources/openapi.yaml (v2)
to the [/static/developers](./static/developers/openapi/gateway) directory and rename them.

## Console
Available on the host/docs of any Console deployment, but also online at [developers.conduktor.io](https://developers.conduktor.io/?product=console).

Copy this file, https://github.com/conduktor/console-plus/blob/main/modules/consoleplus/app/src/main/resources/public-api-doc.yaml
to the [/static/developers](./static/developers/openapi/console) directory.

Add new versions to `static/developers/openapi/manifest.json`.

# Updating the Changelog

For a new release, the changelog should be updated.  You need to create a new Markdown file for the new product version, add import line and then reference it in the changelog index.

## Changes for this version

Add a new MD file in `src/pages/changelog/<product>-<semver>.md` and add the following header to the file:

```
---
date: 2024-11-25
title: Chargeback
description: docker pull conduktor/conduktor-console:1.29.0
solutions: console
tags: features,fix
---

*Release date: {frontMatter.date.toISOString().slice(0, 10)}*
```

You can then document the changes going in to this release, optionally with an index at the start.  See previous files for examples.

## Adding your new changelog file to the index

In `src/pages/changelog.mdx` you must add an import for your new page e.g.

```
import Console1290 from './changelog/Console-1.29.0.md';
```

and then reference it, e.g.

```
## Console 1.29.0
<Console1290 />
---
```

# Docusaurus Snippets

## Resizing images

The images you'll be using in the docs will be automatically sized to the width of the content area.
If you want to resize an image, you can use a snippet like:

```md
import MyImage from './assets/my-image.png';

<img src={MyImage} alt="My Image" style={{ width: 400, display: 'block', margin: 'auto' }} />
```

## Create table with multiple tabs

To create a table similar as [this one](/platform/get-started/configuration/user-authentication/SSO/azure/#console-configuration), you can use the following snippet in your MD file:

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

## Use tags

To use tags as in the [Self-service reference docs](/platform/reference/resource-reference/self-service/), here is an example of snippet:

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


# Vercel

We host the docs using [Vercel](https://vercel.com/) and the build will try to deploy to this platform. Ensure you are a member using `@conduktor.io`, not your personal email (check your Github profile).

You have to be a member of our Vercel workspace for Vercel to build your PR/commits, otherwise the build stage will fail. The workaround is to have a member of the Vercel workspace (e.g. someone from the Product team) change the end of this line each time as the latest commit and trigger a PR. `Change me 0`.
