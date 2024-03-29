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

export const UserRoles = v.union(
	v.literal('org:admin'),
	v.literal('org:moderator'),
	v.literal('org:member'),
);

export default defineSchema({
	users: defineTable({
		tokenIdentifier: v.string(),
		name: v.string(),
		imageUrl: v.string(),
		orgs: v.array(
			v.object({
				id: v.string(),
				role: UserRoles,
			}),
		),
	}).index('by_token_identifier', ['tokenIdentifier']),
	files: defineTable({
		label: v.string(),
		storageId: v.id('_storage'),
		type: FileTypes,
		orgId: v.string(),
		authorId: v.id('users'),
	}).index('by_org_id', ['orgId']),
	favorites: defineTable({
		fileId: v.id('files'),
		userId: v.id('users'),
	})
		.index('by_file_id_user_id', ['fileId', 'userId'])
		.index('by_user_id', ['userId']),
});
