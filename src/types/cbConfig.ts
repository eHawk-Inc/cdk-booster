export type CbConfig = {
  /**
   * Verbose logging
   * @default false
   */
  verbose?: boolean;

  /** Number of Lambdas bundled in a batch with ESBuild
   */
  batch?: number;

  /** Number of parallel ESBuild processes
   */
  parallel?: number;

  /**
   * Path to tsconfig.json file for bundling CDK code
   */
  tsconfig?: string;

  /**
   * Per-file TS transpile strategy for the CDK app code.
   *
   * - `none` (default): esbuild handles TS → JS. Fast, but does NOT emit
   *   `Reflect.metadata("design:type", ...)` calls for `emitDecoratorMetadata`.
   *   Code relying on type-based DI (typedi `@Inject()`, tsyringe, etc.) will
   *   fail at runtime.
   * - `swc`: user TS files (outside `node_modules`) are pre-transpiled with
   *   SWC using `legacyDecorator` + `decoratorMetadata`, then handed to esbuild
   *   as JS. esbuild still does the bundling and CDK-internal patches.
   *   Requires `@swc/core` to be resolvable from the project.
   */
  decorators?: 'none' | 'swc';

  /**
   * Entry file
   */
  entryFile: string;
};
