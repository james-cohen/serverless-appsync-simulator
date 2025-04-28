import * as fs from 'fs';
import { parse } from 'yaml';
import type { AppsyncConfig } from '../src/models';
import constructGraphqlSchema from '../src/schema';

function loadConfig(path: string) {
  const raw = fs.readFileSync(path, 'utf8');
  const parsed = parse(raw) as { appSync: AppsyncConfig };
  return parsed;
}

const defaultConfig = loadConfig('__fixtures__/yaml/test.verbose.yml');
const directConfig = loadConfig('__fixtures__/yaml/test.direct.yml');

describe('schema', () => {
  it('should generate schema from verbose config', () => {
    const schema = constructGraphqlSchema(defaultConfig.appSync);
    expect(schema.replace(/[\r\n]/g, ' ')).toEqual(
      'extend type Query {   testQuery: String }  extend type Mutation {   testMutation(input: TestMutationInput): String }  ' +
        'input TestMutationInput {   test: String }  type Query type Mutation  schema {   query: Query   mutation: Mutation }  ',
    );
  });

  it('should generate schema from direct config', () => {
    const schema = constructGraphqlSchema(directConfig.appSync);
    expect(schema.replace(/[\r\n]/g, ' ')).toEqual(
      'type Query type Mutation  schema {   query: Query   mutation: Mutation }  ',
    );
  });
});
