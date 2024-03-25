import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const FileTypes = v.union(
	v.literal('audio'),
	v.literal('bin'),
	v.literal('csv'),
	v.literal('doc'),
	v.literal('docx'),
	v.literal('html'),
	v.literal('image'),
	v.literal('json'),
	v.literal('pdf'),
	v.literal('ppt'),
	v.literal('pptx'),
	v.literal('rar'),
	v.literal('txt'),
	v.literal('video'),
	v.literal('xls'),
	v.literal('xlsx'),
	v.literal('xml'),
	v.literal('zip'),
	v.literal('other'),
);

export default defineSchema({
	files: defineTable({
		label: v.string(),
		fileId: v.id('_storage'),
		type: FileTypes,
		orgId: v.string(),
	}).index('by_org_id', ['orgId']),
	users: defineTable({
		tokenIdentifier: v.string(),
		name: v.string(),
		imageUrl: v.string(),
		orgIds: v.array(v.string()),
	}).index('by_token_identifier', ['tokenIdentifier']),
});
