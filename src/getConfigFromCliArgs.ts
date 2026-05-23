import { Command, InvalidArgumentError } from 'commander';
import { getVersion } from './version.js';
import { CbConfig } from './types/cbConfig.js';

/**
 * Get configuration from CLI arguments
 * @param supportedFrameworks Supported frameworks
 * @returns Configuration
 */
export async function getConfigFromCliArgs(): Promise<CbConfig> {
  const version = await getVersion();

  const program = new Command();

  program.name('cdk-booster').description('CDK Booster').version(version);
  program.option('-v, --verbose', 'Verbose logging');
  program.option(
    '-b, --batch <number>',
    'Number of Lambdas bundled in a batch with ESBuild',
    parseInteger,
  );
  program.option(
    '-p, --parallel <number>',
    'Number of parallel ESBuild processes. You usually do not need to change this.',
    parseInteger,
  );
  program.option(
    '--tsconfig <path>',
    'Path to tsconfig.json file for bundling CDK code',
  );
  program.option(
    '--decorators <mode>',
    'Per-file TS transpile strategy: "none" (esbuild, default) or "swc" (pre-transpile user TS through SWC to emit decorator metadata for typedi/tsyringe/etc.)',
    parseDecoratorsMode,
    'none',
  );

  program.arguments('<string>');

  program.parse(process.argv);

  const args: any = program.opts();

  const entryFile = program.args[0];
  if (!entryFile) {
    program.outputHelp();
    throw new Error('Entry file is required');
  }
  args.entryFile = entryFile;

  return args;
}

function parseInteger(value: string): number {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

function parseDecoratorsMode(value: string): 'none' | 'swc' {
  if (value !== 'none' && value !== 'swc') {
    throw new InvalidArgumentError(`Expected "none" or "swc", got "${value}".`);
  }
  return value;
}
