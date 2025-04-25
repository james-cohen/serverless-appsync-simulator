import * as fs from 'fs';
import { globSync } from 'glob';
import type { AppsyncConfig } from './models';

function getFilesFromGlobs(globs: string[]) {
  const allFiles: string[] = [];
  globs.forEach((pattern) => {
    // If the pattern starts with '!', it's intended to exclude files. We handle it separately.
    if (pattern.startsWith('!')) {
      const filesToRemove = globSync(pattern.slice(1));
      filesToRemove.forEach((fileToRemove) => {
        const index = allFiles.indexOf(fileToRemove);
        if (index !== -1) {
          allFiles.splice(index, 1);
        }
      });
    } else {
      const filesToAdd = globSync(pattern);
      allFiles.push(...filesToAdd);
    }
  });
  return new Set([...allFiles]);
}

export default function constructGraphqlSchema(config: AppsyncConfig) {
  const schemaPaths = getFilesFromGlobs(config.schema);
  let schema = '';
  schemaPaths.forEach((path) => {
    const fileContent = fs.readFileSync(path, 'utf-8');
    schema += `${fileContent}\n`;
  });
  return schema;
}
