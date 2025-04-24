export function reduceConfig<T>(config: Record<string, T> | Array<Record<string, T>> | undefined) {
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