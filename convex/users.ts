import { ConvexError, v } from 'convex/values';

import {
	MutationCtx,
	QueryCtx,
	internalMutation,
	query,
} from './_generated/server';
import { UserRoles } from './schema';

export const findUserByTokenIdentifier = async (
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
			orgs: [],
		});
	},
});

export const appendOrgToUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		orgId: v.string(),
		orgRole: UserRoles,
	},
	async handler(ctx, args) {
		const user = await findUserByTokenIdentifier(ctx, args.tokenIdentifier);

		await ctx.db.patch(user._id, {
			orgs: [...user.orgs, { id: args.orgId, role: args.orgRole }],
		});
	},
});

export const updateOrgInUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		orgId: v.string(),
		orgRole: UserRoles,
	},
	async handler(ctx, args) {
		const user = await findUserByTokenIdentifier(ctx, args.tokenIdentifier);
		await ctx.db.patch(user._id, {
			orgs: user.orgs.map((org) =>
				org.id === args.orgId ? { ...org, role: args.orgRole } : org,
			),
		});
	},
});

export const removeOrgFromUser = internalMutation({
	args: {
		tokenIdentifier: v.string(),
		orgId: v.string(),
	},
	async handler(ctx, args) {
		const user = await findUserByTokenIdentifier(ctx, args.tokenIdentifier);

		await ctx.db.patch(user._id, {
			orgs: user.orgs.filter((org) => org.id !== args.orgId),
		});
	},
});

export const findUserById = query({
	args: {
		id: v.id('users'),
	},
	async handler(ctx, args) {
		const user = await ctx.db.get(args.id);

		if (!user) {
			throw new ConvexError('User not found');
		}

		return user;
	},
});

export const findUserByAuthId = query({
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
