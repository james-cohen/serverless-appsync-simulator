import { globSync } from 'glob';

export function reduceConfig<T>(
  config: Record<string, T> | Array<Record<string, T>> | undefined,
) {
  if (!config) {
    return {};
  }
  if (Array.isArray(config)) {
    return config.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
  }
  return config;
}

export function getFilesFromGlobs(globs: string[]) {
  const allFiles: string[] = [];
  const sortedGlobs = globs.sort((a, b) => {
    if (a.startsWith('!') && !b.startsWith('!')) {
      return 1;
    }
    if (!a.startsWith('!') && b.startsWith('!')) {
      return -1;
    }
    return a.length - b.length;
  });
  sortedGlobs.forEach((pattern) => {
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
  return Array.from(new Set(allFiles));
}
