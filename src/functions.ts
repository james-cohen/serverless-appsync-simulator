import type { AppSyncSimulatorFunctionsConfig } from '@james-cohen/amplify-appsync-simulator';
import type { AppsyncConfig } from './models';
import { transformTemplateLocation } from './vtl';
import { reduceConfig } from './utils';

export default function generateFunctions(config: AppsyncConfig) {
  const functions: AppSyncSimulatorFunctionsConfig[] = [];
  const pipelineFunctionsInput = reduceConfig(config.pipelineFunctions);
  Object.entries(pipelineFunctionsInput).forEach(([name, val]) => {
    const func: AppSyncSimulatorFunctionsConfig = {
      dataSourceName: val.dataSource,
      name,
      requestMappingTemplateLocation: transformTemplateLocation(
        val.code,
        'req',
      ),
      responseMappingTemplateLocation: transformTemplateLocation(
        val.code,
        'res',
      ),
    };
    functions.push(func);
  });
  return functions;
}
