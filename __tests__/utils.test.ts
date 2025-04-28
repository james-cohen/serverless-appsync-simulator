import { getFilesFromGlobs, reduceConfig } from '../src/utils';

describe(reduceConfig.name, () => {
  it('should return empty object if undefined', () => {
    const config = reduceConfig(undefined);
    expect(config).toEqual({});
  });

  it('should reduce config if array', () => {
    const config = reduceConfig([{ test: 'test' }, { test2: 'test2' }]);
    expect(config).toEqual({
      test: 'test',
      test2: 'test2',
    });
  });

  it('should reduce config if object', () => {
    const config = reduceConfig({ test: 'test', test2: 'test2' });
    expect(config).toEqual({
      test: 'test',
      test2: 'test2',
    });
  });
});

describe(getFilesFromGlobs.name, () => {
  it('should return empty array if no globs', () => {
    const files = getFilesFromGlobs([]);
    expect(files).toEqual([]);
  });

  it('should return files from globs', () => {
    const files = getFilesFromGlobs(['__tests__/**/*.ts']);
    expect(files).toEqual([
      '__tests__/utils.test.ts',
      '__tests__/resolvers.test.ts',
      '__tests__/dataSources.test.ts',
    ]);
  });

  it('should return files from globs with exclusions', () => {
    const files = getFilesFromGlobs([
      '!__tests__/utils.test.ts',
      '__tests__/**/*.ts',
    ]);
    expect(files).toEqual([
      '__tests__/resolvers.test.ts',
      '__tests__/dataSources.test.ts',
    ]);
  });
});
