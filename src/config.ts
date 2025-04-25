import type { AmplifyAppSyncSimulatorConfig } from '@james-cohen/amplify-appsync-simulator';
import { AmplifyAppSyncSimulatorAuthenticationType } from '@james-cohen/amplify-appsync-simulator';
import type Serverless from 'serverless';
import constructGraphqlSchema from './schema';
import generateDataSources from './dataSources';
import generateResolvers from './resolvers';
import type { AppsyncConfig } from './models';
import generateFunctions from './functions';
import { loadMappingTemplates } from './vtl';

export default function getSimulatorConfig(
  sls: Serverless,
): AmplifyAppSyncSimulatorConfig {
  const slsConfig = sls.service.initialServerlessConfig as Record<
    string,
    unknown
  >;
  const config = slsConfig.appSync as AppsyncConfig;
  return {
    appSync: {
      defaultAuthenticationType: {
        authenticationType:
          AmplifyAppSyncSimulatorAuthenticationType.AWS_LAMBDA,
        lambdaAuthorizerConfig: {
          AuthorizerUri: 'test',
        },
      },
      apiKey: 'da2-fakeApiId123456',
      name: 'test',
      additionalAuthenticationProviders: [],
    },
    functions: generateFunctions(config),
    schema: { content: constructGraphqlSchema(config) },
    dataSources: generateDataSources(config, sls.service),
    resolvers: generateResolvers(config),
    mappingTemplates: loadMappingTemplates(config),
  };
}
