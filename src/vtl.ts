import * as fs from 'fs';
import type { AppSyncMockFile } from '@james-cohen/amplify-appsync-simulator';
import type { AppsyncConfig } from './models';
import { reduceConfig } from './utils';

export const defaultRequestTemplate = `{}`;
export const defaultResponseTemplate = `$util.toJson($ctx.prev.result)`;

// HACK: Appsync simulator doesn't support JS resolvers yet. Temp VTL version required
export function transformTemplateLocation(path: string, type: 'req' | 'res') {
  return path
    .replace('/lambda', '/vtl')
    .replace('/local', '/vtl')
    .replace('.ts', `.${type}.vtl`);
}

export function loadMappingTemplates(config: AppsyncConfig) {
  const templatePaths: string[] = [];
  const resolversInput = reduceConfig(config.resolvers);
  Object.values(resolversInput).forEach((resolver) => {
    const { code } = resolver;
    if (code) {
      const reqPath = transformTemplateLocation(code, 'req');
      const resPath = transformTemplateLocation(code, 'res');
      templatePaths.push(reqPath);
      templatePaths.push(resPath);
    }
  });
  const pipelineFunctionsInput = reduceConfig(config.pipelineFunctions);
  Object.values(pipelineFunctionsInput).forEach((val) => {
    const { code } = val;
    if (code) {
      const reqPath = transformTemplateLocation(code, 'req');
      const resPath = transformTemplateLocation(code, 'res');
      templatePaths.push(reqPath);
      templatePaths.push(resPath);
    }
  });
  const uniquePaths = [...new Set(templatePaths)];
  return uniquePaths.map((path) => ({
    path,
    content: fs.readFileSync(path, 'utf-8'),
  })) as AppSyncMockFile[];
}
