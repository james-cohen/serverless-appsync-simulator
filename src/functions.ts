import { AppSyncSimulatorFunctionsConfig } from '@james-cohen/amplify-appsync-simulator';
import { AppsyncConfig } from './models';
import { transformTemplateLocation } from './vtl';

export function generateFunctions(config: AppsyncConfig) {
  const functions: AppSyncSimulatorFunctionsConfig[] = [];
  Object.values(config.pipelineFunctions || {}).forEach((grp) => {
    Object.entries(grp).forEach(([name, val]) => {
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
  });
  return functions;
}
