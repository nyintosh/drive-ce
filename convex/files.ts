import { ConvexError, v } from 'convex/values';

import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';
import { getUser } from './users';

export const hasAccessToOrg = async (
	ctx: QueryCtx | MutationCtx,
	orgId: string,
) => {
	const identity = await ctx.auth.getUserIdentity();

	if (!identity) {
		throw new ConvexError('Unauthorized');
	}

	const user = await getUser(ctx, identity.tokenIdentifier);

	return user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
};

export const create = mutation({
	args: {
		label: v.string(),
		orgId: v.string(),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ConvexError('Unauthorized');
		}

		if (!(await hasAccessToOrg(ctx, args.orgId))) {
			throw new ConvexError('You do not have access to this organization');
		}

		await ctx.db.insert('files', args);
	},
});

export const find = query({
	args: {
		orgId: v.string(),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new ConvexError('Unauthorized');
		}

		if (!(await hasAccessToOrg(ctx, args.orgId))) {
			return [];
		}

		return await ctx.db
			.query('files')
			.withIndex('by_org_id', (q) => q.eq('orgId', args.orgId))
			.collect();
	},
});
