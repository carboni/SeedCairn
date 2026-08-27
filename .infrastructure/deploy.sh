#!/usr/bin/env bash
set -eu

echo "Starting infrastructure build: $(date)"

# Bootstrap is usually only needed once, but if there's a major CDK update it might be needed again
# cdk bootstrap

# Type-check
npm run build

# Show differences
cdk diff

read -p "Do you want to proceed? (y/N) " yn
case $yn in
	y ) echo Deploying...;;
	* ) echo Exit;
		exit 0;;
esac

# Skip approval on the basis we've already done a diff above so this creates a repeat y/n prompt:
cdk deploy --require-approval never --outputs-file cdk.out/cdk-outputs.json

# Update GitHub Actions secrets/variables (WEB_BUCKET, WEB_DISTRIBUTIONID, GHA_OIDC_ROLE)
if [ -f ./github.sh ]; then
  echo "Setting Github secrets and variables..."
  source ./github.sh
  npm run secrets
else
  echo "No github.sh found (see README.md), skipping Github secrets and variables."
fi

echo "End: $(date)"
