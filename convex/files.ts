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

	if (
		!user.orgs.find((org) => org.id === orgId) &&
		!user.tokenIdentifier.includes(orgId)
	) {
		throw new ConvexError("You don't have access to this organization");
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
		!user.orgs.find((org) => org.id === file.orgId) &&
		!user.tokenIdentifier.includes(file.orgId)
	) {
		throw new ConvexError("You don't have access to this file");
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
		throw new ConvexError("You don't have access to this file");
	}

	return { file, user };
};

export const verifyIfModerator = async (
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

	const { user } = await verifyAccessToOrg(ctx, file.orgId);

	const org = user.orgs.find((org) => org.id === file.orgId);
	if (!org) {
		throw new ConvexError('Unexpected error occurred');
	}

	if (
		org.role !== 'org:admin' &&
		org.role !== 'org:moderator' &&
		file.authorId !== user._id
	) {
		throw new ConvexError("You don't have permission for this action");
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

export const ListTypes = v.optional(
	v.union(v.literal('favorites'), v.literal('trash')),
);

export const findAll = query({
	args: {
		orgId: v.string(),
		list: ListTypes,
		query: v.optional(v.string()),
	},
	async handler(ctx, args) {
		const { user } = await verifyAccessToOrg(ctx, args.orgId);

		let files = await ctx.db
			.query('files')
			.withIndex('by_org_id', (q) => q.eq('orgId', args.orgId))
			.collect();

		if (args.list === 'favorites') {
			const favorites = await ctx.db
				.query('favorites')
				.withIndex('by_user_id', (q) => q.eq('userId', user._id))
				.collect();

			files = files.filter((file) =>
				favorites.some((f) => f.fileId === file._id),
			);
		}

		files =
			args.list === 'trash'
				? files.filter((file) => file.deleteAt !== undefined)
				: files.filter((file) => file.deleteAt === undefined);

		if (args.query) {
			files = files.filter((file) =>
				file.label.toLowerCase().includes(args.query!.toLowerCase()),
			);
		}

		return Promise.all(
			files.map(async (file) => ({
				...file,
				url: await ctx.storage.getUrl(file.storageId),
			})),
		);
	},
});

export const checkIfFavorited = query({
	args: {
		fileId: v.id('files'),
		userId: v.id('users'),
	},
	async handler(ctx, args) {
		const { file } = await verifyAccessToFile(ctx, args.fileId);

		const favorite = await ctx.db
			.query('favorites')
			.withIndex('by_file_id_user_id', (q) =>
				q.eq('fileId', file._id).eq('userId', args.userId),
			)
			.first();

		return !!favorite;
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

export const markForDelete = mutation({
	args: {
		fileId: v.id('files'),
	},
	async handler(ctx, args) {
		const { file } = await verifyIfModerator(ctx, args.fileId);

		await ctx.db.patch(file._id, {
			deleteAt: Date.now() + 2592000000,
		});
	},
});

export const restore = mutation({
	args: {
		fileId: v.id('files'),
	},
	async handler(ctx, args) {
		const { file } = await verifyIfModerator(ctx, args.fileId);
		await ctx.db.patch(file._id, {
			deleteAt: undefined,
		});
	},
});

export const remove = mutation({
	args: {
		fileId: v.id('files'),
	},
	async handler(ctx, args) {
		const { file } = await verifyIfModerator(ctx, args.fileId);
		await ctx.db.delete(file._id);
	},
});
