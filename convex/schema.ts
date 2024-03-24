import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	files: defineTable({
		label: v.string(),
		fileId: v.id('_storage'),
		orgId: v.string(),
	}).index('by_org_id', ['orgId']),
	users: defineTable({
		tokenIdentifier: v.string(),
		name: v.string(),
		imageUrl: v.string(),
		orgIds: v.array(v.string()),
	}).index('by_token_identifier', ['tokenIdentifier']),
});
