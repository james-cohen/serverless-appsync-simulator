import * as fs from 'fs';
import { parse } from 'yaml';
import generateDataSources from '../src/dataSources';
import type { AppsyncConfig } from '../src/models';
import mockService from '../__mocks__/mockService';

function loadConfig(path: string) {
  const raw = fs.readFileSync(path, 'utf8');
  const parsed = parse(raw) as { appSync: AppsyncConfig };
  return parsed;
}

const defaultConfig = loadConfig('__fixtures__/yaml/test.verbose.yml');
const directConfig = loadConfig('__fixtures__/yaml/test.direct.yml');

describe('dataSources', () => {
  it('should generate data sources from verbose config', () => {
    const dataSources = generateDataSources(
      defaultConfig.appSync,
      mockService('test'),
    );
    expect(dataSources.length).toBe(2);
    expect(dataSources[0].name).toBe('testQueryLambda');
    expect(dataSources[1].name).toBe('testMutationLambda');
    expect(dataSources.every((ds) => ds.type === 'AWS_LAMBDA')).toBe(true);
  });

  it('should generate data sources from direct config', () => {
    const dataSources = generateDataSources(
      directConfig.appSync,
      mockService('test'),
    );
    expect(dataSources.length).toBe(2);
    expect(dataSources[0].name).toBe('testQueryLambda');
    expect(dataSources[1].name).toBe('testMutationLambda');
    expect(dataSources.every((ds) => ds.type === 'AWS_LAMBDA')).toBe(true);
  });
});
