import type Serverless from 'serverless';

export default function mockService(
  serviceName: string,
): Serverless['service'] {
  return {
    getServiceName: () => serviceName,
    provider: {
      stage: 'dev',
      name: 'aws',
      region: 'us-east-1',
      versionFunctions: false,
      compiledCloudFormationTemplate: {
        Resources: {},
      },
    },
    custom: {},
    serverless: {} as Serverless,
    service: null,
    plugins: [],
    pluginsData: {},
    functions: {},
    resources: {
      Resources: {},
    },
    package: {},
    configValidationMode: '',
    layers: {},
    initialServerlessConfig: undefined,
    load(): Promise<unknown> {
      throw new Error('Function not implemented.');
    },
    setFunctionNames(): void {
      throw new Error('Function not implemented.');
    },
    getAllFunctions(): string[] {
      throw new Error('Function not implemented.');
    },
    getAllFunctionsNames(): string[] {
      throw new Error('Function not implemented.');
    },
    getFunction():
      | Serverless.FunctionDefinitionHandler
      | Serverless.FunctionDefinitionImage {
      throw new Error('Function not implemented.');
    },
    getEventInFunction(): Serverless.Event {
      throw new Error('Function not implemented.');
    },
    getAllEventsInFunction(): Serverless.Event[] {
      throw new Error('Function not implemented.');
    },
    mergeResourceArrays(): void {
      throw new Error('Function not implemented.');
    },
    validate(): import('serverless/classes/Service') {
      throw new Error('Function not implemented.');
    },
    update(): object {
      throw new Error('Function not implemented.');
    },
  };
}
