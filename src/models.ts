import type {
  RESOLVER_KIND,
  AmplifyAppSyncSimulatorAuthenticationType,
} from '@james-cohen/amplify-appsync-simulator';

interface AuthorizerConfig {
  functionArn: string;
  authorizerResultTtlInSeconds?: number;
}

interface FunctionConfig {
  handler: string;
  environment?: Record<string, string>;
  timeout?: number;
}

interface RelationalDatabaseConfig {
  dbClusterIdentifier: string;
  awsRegion: string;
  databaseName: string;
  awsSecretStoreArn: string;
}

interface DataSourceLambdaConfig {
  type: 'AWS_LAMBDA';
  description: string;
  config: {
    serviceRoleArn?: string;
    functionArn?: string;
    function?: FunctionConfig;
  };
}

interface DataSourceRelationalDatabaseConfig {
  type: 'RELATIONAL_DATABASE';
  config: RelationalDatabaseConfig;
}

interface DataSourceNoneConfig {
  type: 'NONE';
  description: string;
}

type DataSourceConfig =
  | DataSourceNoneConfig
  | DataSourceLambdaConfig
  | DataSourceRelationalDatabaseConfig;

interface PipelineFunction {
  dataSource: string;
  code: string;
}

interface Resolver {
  type?: string;
  field?: string;
  kind: RESOLVER_KIND;
  dataSource?: string | DataSourceConfig;
  code?: string;
  functions?: string[];
}

export interface AppsyncConfig {
  name: string;
  schema: string | string[];
  authentication: {
    type: AmplifyAppSyncSimulatorAuthenticationType;
    config: AuthorizerConfig;
  };
  substitutions?: Record<string, string>;
  dataSources?:
    | Array<Record<string, DataSourceConfig>>
    | Record<string, DataSourceConfig>;
  pipelineFunctions?:
    | Array<Record<string, PipelineFunction>>
    | Record<string, PipelineFunction>;
  resolvers: Array<Record<string, Resolver>> | Record<string, Resolver>;
}
