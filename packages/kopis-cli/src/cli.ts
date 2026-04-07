import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { registerDetailCommand } from './commands/detail.js';
import { registerFindCommand } from './commands/find.js';
import { registerVenueCommand } from './commands/venue.js';
import { registerVenueDetailCommand } from './commands/venue-detail.js';

const program = new Command();

program.name('tickets').description(pkg.description).version(pkg.version);

registerFindCommand(program);
registerDetailCommand(program);
registerVenueCommand(program);
registerVenueDetailCommand(program);

program.parse();
