import type {
  AppSyncSimulatorPipelineResolverConfig,
  AppSyncSimulatorUnitResolverConfig,
} from '@james-cohen/amplify-appsync-simulator';
import { RESOLVER_KIND } from '@james-cohen/amplify-appsync-simulator';
import type { AppsyncConfig } from './models';
import {
  defaultRequestTemplate,
  defaultResponseTemplate,
  transformTemplateLocation,
} from './vtl';
import { reduceConfig } from './utils';

export default function generateResolvers(config: AppsyncConfig) {
  const resolvers: (
    | AppSyncSimulatorPipelineResolverConfig
    | AppSyncSimulatorUnitResolverConfig
  )[] = [];
  const resolversInput = reduceConfig(config.resolvers);
  Object.entries(resolversInput).forEach(([id, val]) => {
    const typeName = val.type || id.split('.')[0];
    const fieldName = val.field || id.split('.')[1];
    const { kind, functions, dataSource, code } = val;
    if (kind === RESOLVER_KIND.PIPELINE) {
      const pipeline: AppSyncSimulatorPipelineResolverConfig = {
        kind,
        typeName,
        fieldName,
        functions: functions || [],
        requestMappingTemplateLocation: code
          ? transformTemplateLocation(code, 'req')
          : undefined,
        responseMappingTemplateLocation: code
          ? transformTemplateLocation(code, 'res')
          : undefined,
        requestMappingTemplate: code ? undefined : defaultRequestTemplate,
        responseMappingTemplate: code ? undefined : defaultResponseTemplate,
      };
      resolvers.push(pipeline);
    }
    if (kind === RESOLVER_KIND.UNIT) {
      let dataSourceName = '';
      if (typeof dataSource === 'string') {
        dataSourceName = dataSource;
      } else if (
        typeof dataSource === 'object' &&
        dataSource.type === 'AWS_LAMBDA'
      ) {
        dataSourceName = `${id}Lambda`;
      }
      const unit: AppSyncSimulatorUnitResolverConfig = {
        kind,
        typeName,
        fieldName,
        dataSourceName,
        requestMappingTemplateLocation: code
          ? transformTemplateLocation(code, 'req')
          : undefined,
        responseMappingTemplateLocation: code
          ? transformTemplateLocation(code, 'res')
          : undefined,
        requestMappingTemplate: code ? undefined : defaultRequestTemplate,
        responseMappingTemplate: code ? undefined : defaultResponseTemplate,
      };
      resolvers.push(unit);
    }
  });
  return resolvers;
}
