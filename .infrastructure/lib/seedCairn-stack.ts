import { Construct } from 'constructs';
import { CfnOutput, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { WebFrontend, githubActions } from '@scloud/cdk-patterns';

export class SeedCairnStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const zone = new HostedZone(this, 'seedcairn', {
      zoneName: 'seedcairn.com',
    });
    new CfnOutput(this, 'nameServers', { value: Fn.join(', ', zone.hostedZoneNameServers!) });

    // https://seedcairn.com — the landing page, built and deployed by .github/workflows/web.yml
    new WebFrontend(this, 'web', {
      zone,
      defaultIndex: true,
      redirectWww: true,
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 404, responsePagePath: '/404.html' },
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: '/404.html' },
      ],
    });

    // https://app.seedcairn.com — the web build of the Expo app, built and deployed by .github/workflows/app.yml
    new WebFrontend(this, 'webapp', {
      zone,
      domainName: 'app.seedcairn.com',
      defaultIndex: true,
      redirectWww: false,
    });

    // Keyless access from GHA to AWS. Also publishes GHA_OIDC_ROLE as a
    // GitHub Actions repo variable.
    const oidcProvider = githubActions(this).ghaOidcProvider();
    githubActions(this).ghaOidcRole({ owner: 'carboni', repo: 'SeedCairn', filter: 'ref:refs/heads/main' }, oidcProvider);
  }
}
