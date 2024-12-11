# Conduktor Docs
Production (main): https://docs.conduktor.io

# Development
For local preview run `yarn` , `yarn start`, a local server starts on localhost:3000. `yarn build` is best practice to see if any failures, as this is what the remote will check on each commit.
```
$ yarn
$ yarn start
$ yarn build
```

Unless you are making changes to the docs framework or updating the changelog, you should only need to edit the Markdown files in the `docs` directory.

Console documentation is found under the `docs/platform` directory. The path of the MD files mirrors that of the website url.

- Images can be stored in an `img` directory alongside the content
- Anchor example, [env variables](docs/platform/get-started/configuration/env-variables.md#auditlog-export-properties)
- If linking to a category page that doesn't have an index then use `/gateway/category/<category-name>` same for `/console/...`

# Updating public API docs

## Gateway
They live on the host:8888 of the deployed Gateway, but we also publish them online at [developers.conduktor.io](https://www.developers.conduktor.io).

To update the public version copy the latest open api yaml files from conduktor-proxy repo,
https://github.com/conduktor/conduktor-proxy/blob/main/proxy/src/main/resources/gateway-API.yaml (v1)
and https://github.com/conduktor/conduktor-proxy/blob/main/api-definition/src/main/resources/openapi.yaml (v2)
to the [/static/developers](./static/developers/openapi/gateway) directory and rename them.

## Console
Available on the host/docs.
Copy this file, https://github.com/conduktor/console-plus/blob/main/modules/consoleplus/app/src/main/resources/public-api-doc.yaml
to the [/static/developers](./static/developers/openapi/console) directory.

Add new versions to static/developers/openapi/manifest.json.

# Updating the Changelog

For a new release, the changelog should be updated.  You need to create a new Markdown file for the new product version, and then reference it in the changelog index.

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

# Vercel

We host the docs using [Vercel](https://vercel.com/) and the build will try to deploy to this platform. Ensure you are a member using `@conduktor.io`, not your personal email (check your Github profile).

You have to be a member of our Vercel workspace for Vercel to build your PR/commits, otherwise the build stage will fail. The workaround is to have a member of the Vercel workspace (e.g. someone from the Product team) change the end of this line each time as the latest commit and trigger a PR. `Change me 0`.
