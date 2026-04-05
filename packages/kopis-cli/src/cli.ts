import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { registerDetailCommand } from './commands/detail.js';
import { registerFindCommand } from './commands/find.js';

const program = new Command();

program.name('tickets').description(pkg.description).version(pkg.version);

registerFindCommand(program);
registerDetailCommand(program);

program.parse();
