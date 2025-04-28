import * as fs from 'fs';
import { parse } from 'yaml';
import type { AppSyncSimulatorUnitResolverConfig } from '@james-cohen/amplify-appsync-simulator';
import { RESOLVER_KIND } from '@james-cohen/amplify-appsync-simulator';
import type { AppsyncConfig } from '../src/models';
import generateResolvers from '../src/resolvers';
import {
  DEFAULT_RESPONSE_TEMPLATE,
  DEFAULT_REQUEST_TEMPLATE,
} from '../src/vtl';

function loadConfig(path: string) {
  const raw = fs.readFileSync(path, 'utf8');
  const parsed = parse(raw) as { appSync: AppsyncConfig };
  return parsed;
}

const defaultConfig = loadConfig('__fixtures__/yaml/test.verbose.yml');
const directConfig = loadConfig('__fixtures__/yaml/test.direct.yml');

describe('resolvers', () => {
  it('should generate resolvers from verbose config', () => {
    const resolvers = generateResolvers(defaultConfig.appSync);
    expect(resolvers.length).toBe(2);
    expect(resolvers[0]).toMatchObject<AppSyncSimulatorUnitResolverConfig>({
      kind: RESOLVER_KIND.UNIT,
      typeName: 'Query',
      fieldName: 'testQuery',
      dataSourceName: 'testQueryLambda',
      requestMappingTemplateLocation: '__fixtures__/resolvers/default.req.vtl',
      responseMappingTemplateLocation: '__fixtures__/resolvers/default.res.vtl',
    });
    expect(resolvers[1]).toMatchObject<AppSyncSimulatorUnitResolverConfig>({
      kind: RESOLVER_KIND.UNIT,
      typeName: 'Mutation',
      fieldName: 'testMutation',
      dataSourceName: 'testMutationLambda',
      requestMappingTemplateLocation: '__fixtures__/resolvers/default.req.vtl',
      responseMappingTemplateLocation: '__fixtures__/resolvers/default.res.vtl',
    });
  });

  it('should generate data sources from direct config', () => {
    const resolvers = generateResolvers(directConfig.appSync);
    expect(resolvers.length).toBe(2);
    expect(resolvers[0]).toMatchObject<AppSyncSimulatorUnitResolverConfig>({
      kind: RESOLVER_KIND.UNIT,
      typeName: 'Query',
      fieldName: 'testQuery',
      dataSourceName: 'testQueryLambda',
      requestMappingTemplate: DEFAULT_REQUEST_TEMPLATE,
      responseMappingTemplate: DEFAULT_RESPONSE_TEMPLATE,
    });
    expect(resolvers[1]).toMatchObject<AppSyncSimulatorUnitResolverConfig>({
      kind: RESOLVER_KIND.UNIT,
      typeName: 'Mutation',
      fieldName: 'testMutation',
      dataSourceName: 'testMutationLambda',
      requestMappingTemplate: DEFAULT_REQUEST_TEMPLATE,
      responseMappingTemplate: DEFAULT_RESPONSE_TEMPLATE,
    });
  });
});
