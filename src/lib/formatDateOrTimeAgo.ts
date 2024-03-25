import { format, formatDistanceToNow } from 'date-fns';

export const formatDateOrTimeAgo = (createdAt: Date) => {
	const currentDate = new Date();
	const differenceInDays = Math.abs(
		Math.round(
			(currentDate.getTime() - createdAt.getTime()) / (1000 * 3600 * 24),
		),
	);

	if (differenceInDays > 1) {
		return format(createdAt, 'MMM dd, yyyy');
	} else {
		return formatDistanceToNow(createdAt, { addSuffix: true });
	}
};
