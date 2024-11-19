# Conduktor Docs

- Use relative paths and trailing slashes for links (e.g `/platform/testing/features/ci-cd-automation/` instead of `../../features/ci-cd-automation/`)
or, [user reference doc](/gateway/reference/user).
- If linking to a category page that doesn't have an index then use `/gateway/category/<category-name>` same for `/console/...`. 
- Production (main): https://docs.conduktor.io
- Anchor example, [env variables](docs/platform/get-started/configuration/env-variables.md#auditlog-export-properties)

# Development

```
$ yarn
$ yarn start
$ yarn build
```

# Vercel

You have to be a member of our Vercel workspace for Vercel to build your PR/commits.

Ensure you are a member using `@conduktor.io`, not your personal email (check your Github profile).

Or have someone from Vercel change this line each time as the latest commit. `Change me 0`.

# Updating public GW API doc
For now they live on the host:8888 of Gateway, but we also publish them online at [developers.conduktor.io](https://www.developers.conduktor.io).

To update the public version copy the latest open api yaml files from conduktor-proxy repo, https://github.com/conduktor/conduktor-proxy/blob/main/proxy/src/main/resources/gateway-API.yaml and https://github.com/conduktor/conduktor-proxy/blob/main/api-definition/src/main/resources/openapi.yaml to the [/static/developers](./static/developers/).
