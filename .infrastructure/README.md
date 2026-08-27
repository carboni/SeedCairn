# Infrastructure

CDK stack for [seedcairn.com](https://seedcairn.com): a Route53 hosted zone and a `WebFrontend`
(S3 bucket + Cloudfront distribution + ACM certificate) from
[`@scloud/cdk-patterns`](https://www.npmjs.com/package/@scloud/cdk-patterns), plus a GitHub
Actions OIDC role so `.github/workflows/web.yml` can deploy the landing page without long-lived
AWS credentials. Follows the same pattern as `../hairtracker/.infrastructure` and
`../education/.infrastructure`.

`WebFrontend` registers its own bucket and distribution with the OIDC role and publishes
`WEB_BUCKET` / `WEB_DISTRIBUTIONID` as GitHub Actions repo variables automatically — nothing
extra to wire up for those. `ghaOidcRole()` similarly publishes `GHA_OIDC_ROLE`.

## First-time setup

1. `npm install`
2. `npx cdk bootstrap` (once per AWS account/region)
3. Create `github.sh` (gitignored — never commit this) with a GitHub personal access token that
   has repo admin access, to let `cdk-github` sync secrets/variables after deploy:

   ```bash
   export USERNAME=<your-github-username>
   export PERSONAL_ACCESS_TOKEN=<a-github-pat-with-repo-admin-scope>
   export OWNER=carboni
   export REPO=SeedCairn
   ```

## Deploy

```bash
./deploy.sh
```

Runs a type-check, shows `cdk diff`, deploys on confirmation, then syncs the resulting
`WEB_BUCKET` / `WEB_DISTRIBUTIONID` / `GHA_OIDC_ROLE` values to the GitHub repo as Actions
variables (via `github.sh` + `npm run secrets`).

Use `./diff.sh` to just see what would change.

## After the first deploy

The stack creates a new Route53 hosted zone for `seedcairn.com`. Copy the name servers from the
`nameServers` stack output (or the AWS Console) and set them as the NS records at your domain
registrar, so `seedcairn.com` actually resolves via this zone. Certificate validation and the
CloudFront distribution won't go live until that delegation has propagated.
