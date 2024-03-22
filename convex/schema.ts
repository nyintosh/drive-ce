import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	files: defineTable({
		label: v.string(),
		orgId: v.string(),
	}).index('by_org_id', ['orgId']),
	users: defineTable({
		tokenIdentifier: v.string(),
		name: v.string(),
		image_url: v.string(),
		orgIds: v.array(v.string()),
	}).index('by_token_identifier', ['tokenIdentifier']),
});
