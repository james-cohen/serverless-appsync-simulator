import {
  AmplifyAppSyncSimulatorAuthenticationType,
  AmplifyAppSyncSimulatorConfig,
} from '@james-cohen/amplify-appsync-simulator';
import { constructGraphqlSchema } from './schema';
import { generateDataSources } from './dataSources';
import { generateResolvers } from './resolvers';
import { AppsyncConfig } from './models';
import { generateFunctions } from './functions';
import { loadMappingTemplates } from './vtl';
import Serverless from 'serverless';

export function getSimulatorConfig(
  sls: Serverless,
): AmplifyAppSyncSimulatorConfig {
  const config: AppsyncConfig = sls.service.initialServerlessConfig.appSync;
  return {
    appSync: {
      defaultAuthenticationType: {
        authenticationType: AmplifyAppSyncSimulatorAuthenticationType.AWS_LAMBDA,
        lambdaAuthorizerConfig: {
          AuthorizerUri: 'test'
        }
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
