import { ConvexError, v } from 'convex/values';

import {
	MutationCtx,
	QueryCtx,
	internalMutation,
	query,
} from './_generated/server';

export const getUser = async (
	ctx: QueryCtx | MutationCtx,
	tokenIdentifier: string,
) => {
	const user = await ctx.db
		.query('users')
		.withIndex('by_token_identifier', (q) =>
			q.eq('tokenIdentifier', tokenIdentifier),
		)
		.first();

	if (!user) {
		throw new ConvexError('User not found');
	}

	return user;
};

export const create = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		name: v.string(),
		imageUrl: v.string(),
	},
	async handler(ctx, args) {
		await ctx.db.insert('users', {
			...args,
			orgIds: [],
		});
	},
});

export const addOrgIdToUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		orgId: v.string(),
	},
	async handler(ctx, { tokenIdentifier, orgId }) {
		const user = await getUser(ctx, tokenIdentifier);

		await ctx.db.patch(user._id, {
			orgIds: [...user.orgIds, orgId],
		});
	},
});

export const getUserById = query({
	args: {
		id: v.string(),
	},
	async handler(ctx, args) {
		const user = await ctx.db
			.query('users')
			.withIndex('by_token_identifier', (q) =>
				q.eq(
					'tokenIdentifier',
					`https://lasting-troll-75.clerk.accounts.dev|${args.id}`,
				),
			)
			.first();

		if (!user) {
			throw new ConvexError('User not found');
		}

		return user;
	},
});
