import { formatDistanceToNow, formatRelative } from 'date-fns';

export const formatRelativeOrDistanceToNow = (createdAt: Date) => {
	const currentDate = new Date();
	const differenceInDays = Math.abs(
		Math.round(
			(currentDate.getTime() - createdAt.getTime()) / (1000 * 3600 * 24),
		),
	);

	if (differenceInDays > 1) {
		return formatRelative(createdAt, currentDate);
	} else {
		return formatDistanceToNow(createdAt, { addSuffix: true });
	}
};

export const formatHourLeft = (date: Date) => {
	const differenceInHours = Math.abs(
		Math.round((date.getTime() - new Date().getTime()) / (1000 * 3600)),
	);

	if (differenceInHours > 24) {
		return `${Math.floor(differenceInHours / 24)} days`;
	} else if (differenceInHours > 1) {
		return `${Math.floor(differenceInHours)} hours`;
	} else {
		return `less than an hour`;
	}
};
