import {
  RESOLVER_KIND,
  AmplifyAppSyncSimulatorAuthenticationType,
} from '@james-cohen/amplify-appsync-simulator';

interface LambdaConfig {
  functionArn: string;
  authorizerResultTtlInSeconds?: number;
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
    functionArn: string;
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
  kind: RESOLVER_KIND;
  dataSource?: string;
  code?: string;
  functions?: string[];
}
type Resolvers = Record<string, Resolver>;

export interface AppsyncConfig {
  name: string;
  schema: string[];
  authentication: {
    type: AmplifyAppSyncSimulatorAuthenticationType;
    config: LambdaConfig;
  };
  substitutions: Record<string, string>;
  dataSources: Array<Record<string, DataSourceConfig>>;
  pipelineFunctions: Array<Record<string, PipelineFunction>>;
  resolvers: Resolvers[];
}
