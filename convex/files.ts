import { ConvexError, v } from 'convex/values';

import { Id } from './_generated/dataModel';
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';
import { FileTypes } from './schema';
import { findUserByTokenIdentifier } from './users';

export const generateUploadUrl = mutation(async (ctx) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new ConvexError('Unauthorized');
	}

	return await ctx.storage.generateUploadUrl();
});

export const verifyAccessToOrg = async (
	ctx: QueryCtx | MutationCtx,
	orgId: string,
) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new ConvexError('Unauthorized');
	}

	const user = await findUserByTokenIdentifier(ctx, identity.tokenIdentifier);

	if (!user.orgIds.includes(orgId) && !user.tokenIdentifier.includes(orgId)) {
		throw new ConvexError('You do not have access to this organization');
	}

	return { user };
};

export const verifyAccessToFile = async (
	ctx: QueryCtx | MutationCtx,
	fileId: Id<'files'>,
) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new ConvexError('Unauthorized');
	}

	const file = await ctx.db.get(fileId);
	if (!file) {
		throw new ConvexError('File not found');
	}

	const user = await findUserByTokenIdentifier(ctx, identity.tokenIdentifier);
	if (!user) {
		throw new ConvexError('User not found');
	}

	if (
		!user.orgIds.includes(file.orgId) &&
		!user.tokenIdentifier.includes(file.orgId)
	) {
		throw new ConvexError('You do not have access to this file');
	}

	return { file, user };
};

export const verifyIfAuthor = async (
	ctx: QueryCtx | MutationCtx,
	fileId: Id<'files'>,
) => {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new ConvexError('Unauthorized');
	}

	const file = await ctx.db.get(fileId);
	if (!file) {
		throw new ConvexError('File not found');
	}

	const user = await findUserByTokenIdentifier(ctx, identity.tokenIdentifier);
	if (!user) {
		throw new ConvexError('User not found');
	}

	if (file.authorId !== user._id) {
		throw new ConvexError('You do not have access to this file');
	}

	return { file, user };
};

export const createFile = mutation({
	args: {
		label: v.string(),
		storageId: v.id('_storage'),
		type: FileTypes,
		orgId: v.string(),
		authorId: v.id('users'),
	},
	async handler(ctx, args) {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new ConvexError('Unauthorized');
		}

		await verifyAccessToOrg(ctx, args.orgId);

		await ctx.db.insert('files', args);
	},
});

export const findAll = query({
	args: {
		orgId: v.string(),
		isFavorite: v.optional(v.boolean()),
		query: v.optional(v.string()),
	},
	async handler(ctx, args) {
		const { user } = await verifyAccessToOrg(ctx, args.orgId);

		const favorites = await ctx.db
			.query('favorites')
			.withIndex('by_user_id', (q) => q.eq('userId', user._id))
			.collect();

		let files = (
			await ctx.db
				.query('files')
				.withIndex('by_org_id', (q) => q.eq('orgId', args.orgId))
				.collect()
		).filter((file) => {
			if (!args.query) return file;
			return file.label.toLowerCase().includes(args.query.toLowerCase());
		});

		files = args.isFavorite
			? files.filter((file) => favorites.some((f) => f.fileId === file._id))
			: files;

		return Promise.all(
			files.map(async (file) => ({
				...file,
				url: await ctx.storage.getUrl(file.storageId),
			})),
		);
	},
});

export const toggleFavorite = mutation({
	args: {
		fileId: v.id('files'),
	},
	async handler(ctx, args) {
		const { file, user } = await verifyAccessToFile(ctx, args.fileId);

		const favorites = await ctx.db
			.query('favorites')
			.withIndex('by_file_id_user_id', (q) =>
				q.eq('fileId', file._id).eq('userId', user._id),
			)
			.first();

		if (!favorites) {
			await ctx.db.insert('favorites', {
				fileId: args.fileId,
				userId: user._id,
			});
		} else {
			await ctx.db.delete(favorites._id);
		}
	},
});

export const remove = mutation({
	args: {
		fileId: v.id('files'),
	},
	async handler(ctx, args) {
		const { file } = await verifyIfAuthor(ctx, args.fileId);
		await ctx.db.delete(file._id);
	},
});
