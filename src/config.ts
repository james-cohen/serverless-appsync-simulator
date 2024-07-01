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

export function getSimulatorConfig(
  config: AppsyncConfig,
): AmplifyAppSyncSimulatorConfig {
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
    dataSources: generateDataSources(config),
    resolvers: generateResolvers(config),
    mappingTemplates: loadMappingTemplates(config),
  };
}
