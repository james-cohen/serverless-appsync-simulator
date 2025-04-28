import * as fs from 'fs';
import type { AppsyncConfig } from './models';
import { getFilesFromGlobs } from './utils';

export default function constructGraphqlSchema(config: AppsyncConfig) {
  const globs = Array.isArray(config.schema) ? config.schema : [config.schema];
  const schemaPaths = getFilesFromGlobs(globs).filter(
    (path) => path.endsWith('.graphql') || path.endsWith('.gql'),
  );
  let schema = '';
  schemaPaths.forEach((path) => {
    const fileContent = fs.readFileSync(path, 'utf-8');
    schema += `${fileContent}\n`;
  });
  return schema;
}
