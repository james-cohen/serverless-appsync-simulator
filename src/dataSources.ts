import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import {
  AppSyncSimulatorDataSourceConfig,
  AppSyncSimulatorDataSourceLambdaConfig,
  AppSyncSimulatorDataSourceNoneConfig,
} from '@aws-amplify/amplify-appsync-simulator';
import { AppsyncConfig } from './models';

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

export function generateDataSources(config: AppsyncConfig) {
  const dataSources: AppSyncSimulatorDataSourceConfig[] = [];
  const dataSourceConfig = config.dataSources || {};
  dataSourceConfig.forEach((grp) => {
    Object.entries(grp).forEach(([name, val]) => {
      if (val.type === 'AWS_LAMBDA') {
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
      if (val.type === 'NONE') {
        const noneDataSource: AppSyncSimulatorDataSourceNoneConfig = {
          type: 'NONE',
          name,
        }
        dataSources.push(noneDataSource);
      }
    });
  });
  return dataSources;
}
