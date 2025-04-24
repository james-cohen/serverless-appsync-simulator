import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import {
  AppSyncSimulatorDataSourceConfig,
  AppSyncSimulatorDataSourceLambdaConfig,
  AppSyncSimulatorDataSourceNoneConfig,
} from '@james-cohen/amplify-appsync-simulator';
import { AppsyncConfig } from './models';
import Service from 'serverless/classes/Service';
import { reduceConfig } from './utils';

const endpoint = 'http://localhost:3002';

async function invokeLambdaFunction(
  functionName: string,
  payload: Record<string, unknown>,
  awaitResponse: boolean,
  endpoint = '',
) {
  const client = new LambdaClient({ endpoint });
  const command = new InvokeCommand({
    FunctionName: functionName,
    InvocationType: awaitResponse ? 'RequestResponse' : 'Event',
    Payload: JSON.stringify(payload),
  });
  return client.send(command);
}

export function generateDataSources(config: AppsyncConfig, service: Service) {
  const dataSources: AppSyncSimulatorDataSourceConfig[] = [];
  const dataSourceConfig = reduceConfig(config.dataSources);

  if (!Object.keys(dataSourceConfig).length) {
    const resolvers = reduceConfig(config.resolvers);
    Object.entries(resolvers).forEach(([name, resolver]) => {
      if (resolver.type === 'AWS_LAMBDA' && resolver.dataSource && typeof resolver.dataSource !== 'string') {
        const dataSourceName = `${name}Lambda`
        dataSourceConfig[dataSourceName] = resolver.dataSource;
      }
    });
  }
  Object.entries(dataSourceConfig).forEach(([name, val]) => {
    if (val.type === 'AWS_LAMBDA' && val.config.functionArn) {
      const arnParts = val.config.functionArn.split(':');
        const id = arnParts[arnParts.length - 1];
        const lambdaDataSource: AppSyncSimulatorDataSourceLambdaConfig = {
          type: 'AWS_LAMBDA',
          name,
          invoke: async (payload: Record<string, unknown>) => {
            const response = await invokeLambdaFunction(id, payload, true, endpoint);
            return JSON.parse(Buffer.from(response.Payload || []).toString());
          },
        };
        dataSources.push(lambdaDataSource);
      }
      if (val.type === 'AWS_LAMBDA' && val.config.function) {
        const serviceName = service.getServiceName();
        const { stage } = service.provider;
        const functionName = `${serviceName}-${stage}-${name}`;
        const lambdaDataSource: AppSyncSimulatorDataSourceLambdaConfig = {
          type: 'AWS_LAMBDA',
          name,
          invoke: async (payload: Record<string, unknown>) => {
            const response = await invokeLambdaFunction(functionName, payload, true, endpoint);
            return JSON.parse(Buffer.from(response.Payload || []).toString());
          },
        };
        dataSources.push(lambdaDataSource);
      }
      if (val.type === 'NONE') {
        const noneDataSource: AppSyncSimulatorDataSourceNoneConfig = {
          type: 'NONE',
          name,
        }
      dataSources.push(noneDataSource);
    }
  });
  return dataSources;
}
