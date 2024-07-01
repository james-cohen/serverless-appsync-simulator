import {
  AppSyncSimulatorPipelineResolverConfig,
  AppSyncSimulatorUnitResolverConfig,
  RESOLVER_KIND,
} from '@james-cohen/amplify-appsync-simulator';
import { AppsyncConfig } from './models';
import {
  defaultRequestTemplate,
  defaultResponseTemplate,
  transformTemplateLocation,
} from './vtl';

export function generateResolvers(config: AppsyncConfig) {
  const resolvers: (
    | AppSyncSimulatorPipelineResolverConfig
    | AppSyncSimulatorUnitResolverConfig
  )[] = [];
  Object.values(config.resolvers || {}).forEach((grp) => {
    Object.entries(grp).forEach(([id, val]) => {
      const [typeName, fieldName] = id.split('.');
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
        const unit: AppSyncSimulatorUnitResolverConfig = {
          kind,
          typeName,
          fieldName,
          dataSourceName: dataSource || '',
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
  });
  return resolvers;
}
