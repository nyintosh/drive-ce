import { ConvexError, v } from 'convex/values';

import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';
import { FileTypes } from './schema';
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

export const generateUploadUrl = mutation(async (ctx) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new ConvexError('Unauthorized');
	}

	return await ctx.storage.generateUploadUrl();
});

export const createFile = mutation({
	args: {
		label: v.string(),
		storageId: v.id('_storage'),
		type: FileTypes,
		orgId: v.string(),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError('Unauthorized');
		}

		const hasRight = await hasAccessToOrg(ctx, args.orgId);
		if (!hasRight) {
			throw new ConvexError('You do not have access to this organization');
		}

		await ctx.db.insert('files', args);
	},
});

export const findAll = query({
	args: {
		orgId: v.string(),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError('Unauthorized');
		}

		const hasRight = await hasAccessToOrg(ctx, args.orgId);
		if (!hasRight) {
			return [];
		}

		return await ctx.db
			.query('files')
			.withIndex('by_org_id', (q) => q.eq('orgId', args.orgId))
			.collect();
	},
});

export const deleteFile = mutation({
	args: {
		fileId: v.id('files'),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError('Unauthorized');
		}

		const file = await ctx.db.get(args.fileId);
		if (!file) {
			throw new ConvexError('File not found');
		}

		const hasRight = await hasAccessToOrg(ctx, file.orgId);
		if (!hasRight) {
			throw new ConvexError('You do not have access to this organization');
		}

		await ctx.db.delete(args.fileId);
	},
});
