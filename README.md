# Conduktor technical docs

- [Deployment and structure](#deployment-and-structure)
- [Docs guidelines](#best-practice-guidelines)
  - [Structure](#structure)
  - [Images](#images)
  - [Links](#links)
- [Update release notes](#update-release-notes)
- [Update public API docs](#update-public-api-docs)

## Deployment and structure

Production is on `main`: [https://docs.conduktor.io](https://docs.conduktor.io).

We're now using Mintlify! `npm i -g mint` or `npx mint dev` if you don't want to install the CLI globally.

[Here's more about the Mintlify installation](https://mintlify.com/docs/installation).

In most cases, you'll be editing Markdown files in the **guide** directory.

For a local preview (on *localhost:3000*), run `mint dev`.

You can check for broken links with `mint broken-links`.

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

### Links

Use absolute links when linking to Conduktor docs, e.g. */guide/get-started/hardware/*.

You can also link to a specific section on a page, e.g. */guide/get-started/hardware/#hardware-requirements*.

## Update release notes

Every new version of Gateway and Console has to have release notes.

To update release notes:

1. Go to **/snippets/changelog**.
2. Create a new file or copy an existing one and rename it. The name has to be in this format: `<productName>-<versionNumber>.mdx`.
3. Make sure your file has the following header:

    ```mdx
    ---
    title: Product and version
    ---

    *Release date: {date}*
    ```

4. Document all the changes in the release. If it's a:

- **major release** with lots of changes, consider adding a table of contents at the top to make it easier to read.
- release containing **breaking changes**: add a meaningful title and explain why the change was made. Most importantly, explain how to know (or check) whether you're impacted ("put yourself in customer's shoes"). Remember to explain what to change or do next, if anything.

5. Open `release-notes/index.mdx` and import your new file, e.g.:

```
import Console1310 from './changelog/Console-1.31.0.mdx';
```

6. Finally, add an entry at the top of the page, linking to your file. E.g.:

```
## Console 1.131.0
<Console1310 />
---
```

## Update public API docs

[API docs are now in a separate repo](https://github.com/conduktor/developers.conduktor.io).
