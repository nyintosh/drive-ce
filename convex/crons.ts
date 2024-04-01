import { cronJobs } from 'convex/server';

import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
	'remove files scheduled for deletion',
	{ hours: 8 },
	internal.files.scheduleDelete,
);

export default crons;
