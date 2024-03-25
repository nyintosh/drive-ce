import { Doc } from '@convex/_generated/dataModel';

export const getFileFormat = (mimeType: string) => {
	const formatMap: { [key: string]: Doc<'files'>['type'] } = {
		'application/json': 'json',
		'application/msword': 'doc',
		'application/octet-stream': 'bin',
		'application/ogg': 'audio',
		'application/pdf': 'pdf',
		'application/smil': 'video',
		'application/vnd.ms-excel': 'xls',
		'application/vnd.ms-powerpoint': 'ppt',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			'pptx',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			'docx',
		'application/zip': 'zip',
		'application/vnd.rar': 'rar',
		'audio/*': 'audio',
		'image/*': 'image',
		'text/csv': 'csv',
		'text/html': 'html',
		'text/plain': 'txt',
		'text/xml': 'xml',
		'video/*': 'video',
	};

	for (const key in formatMap) {
		if (key.endsWith('/*') && mimeType.startsWith(key.slice(0, -1))) {
			return formatMap[key];
		}
	}

	return formatMap[mimeType] ?? 'other';
};
