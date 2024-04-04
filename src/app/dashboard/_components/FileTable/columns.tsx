'use client';

import { useUser } from '@clerk/nextjs';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery } from 'convex/react';
import Image from 'next/image';

import { api } from '@convex/_generated/api';
import { Doc } from '@convex/_generated/dataModel';

import { FileActions } from '@/components/FileActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	formatHourLeft,
	formatRelativeOrDistanceToNow,
} from '@/lib/formatDate';

import { fileIcons } from '../FileCard';

export const columns: ColumnDef<Doc<'files'> & { url: string | null }>[] = [
	{
		accessorKey: 'url',
		header: '',
		cell: ({ row }) => {
			return row.original.type === 'image' && row.original.url ? (
				<Image
					className='aspect-[4/3] h-10 border object-cover shadow-sm'
					src={row.original.url}
					alt={row.original.label}
					width={53}
					height={40}
				/>
			) : (
				<div className='grid aspect-[4/3] h-10 place-items-center'>
					{fileIcons[row.original.type]('size-5')}
				</div>
			);
		},
	},
	{
		accessorKey: 'label',
		header: 'Name',
	},
	{
		accessorKey: 'type',
		header: 'Type',
	},
	{
		header: 'Author',
		cell: ({ row }) => {
			return <AuthorCell file={row.original} />;
		},
	},
	{
		header: 'Uploaded At',
		cell: ({ row }) => {
			return <UploadedAtCell file={row.original} />;
		},
	},
	{
		header: 'Actions',
		cell: ({ row }) => {
			return <ActionsCell file={row.original} />;
		},
	},
];

const AuthorCell = ({
	file,
}: {
	file: Doc<'files'> & { url: string | null };
}) => {
	const { user } = useUser();

	const author = useQuery(api.users.findUserById, { id: file.authorId });
	const userInfo = useQuery(
		api.users.findUserByAuthId,
		user?.id ? { id: user.id } : 'skip',
	);

	const isAuthor = userInfo?._id === file.authorId;

	return (
		<div className='flex items-center gap-2'>
			<Avatar className='size-5 min-w-5'>
				<AvatarImage src={author?.imageUrl} alt={author?.name} />
				<AvatarFallback>{author?.name[0]}</AvatarFallback>
			</Avatar>
			<span className='line-clamp-1'>{isAuthor ? 'You' : author?.name}</span>
		</div>
	);
};

const UploadedAtCell = ({
	file,
}: {
	file: Doc<'files'> & { url: string | null };
}) => {
	const { user } = useUser();

	const userInfo = useQuery(
		api.users.findUserByAuthId,
		user?.id ? { id: user.id } : 'skip',
	);

	const deleteBy = useQuery(
		api.users.findUserById,
		file.deleteBy ? { id: file.deleteBy } : 'skip',
	);

	return (
		<div>
			<p className='whitespace-nowrap text-xs'>
				{formatRelativeOrDistanceToNow(new Date(file._creationTime))}
			</p>

			{!!file.scheduleDeleteAt && (
				<p className='absolute -bottom-0 left-2 line-clamp-1 h-3 w-max max-w-[calc(100%-1rem)] rounded-t-sm bg-amber-400 px-1 text-[0.5rem] leading-3'>
					{deleteBy?._id === userInfo?._id ? 'You' : deleteBy?.name} •{' '}
					{formatHourLeft(new Date(file.scheduleDeleteAt))} left to recover
				</p>
			)}
		</div>
	);
};

const ActionsCell = ({
	file,
}: {
	file: Doc<'files'> & { url: string | null };
}) => {
	const { user } = useUser();

	const userInfo = useQuery(
		api.users.findUserByAuthId,
		user?.id ? { id: user.id } : 'skip',
	);

	const isAuthor = userInfo?._id === file.authorId;

	const isFavorited = useQuery(
		api.files.checkIfFavorited,
		file._id && userInfo?._id
			? { fileId: file._id, userId: userInfo?._id }
			: 'skip',
	);

	const deleteBy = useQuery(
		api.users.findUserById,
		file.deleteBy ? { id: file.deleteBy } : 'skip',
	);

	return (
		<div className='flex items-center pl-[1.125rem]'>
			<FileActions
				file={file}
				isAuthor={isAuthor}
				isFavorited={!!isFavorited}
				isTrash={!!deleteBy}
			/>
		</div>
	);
};
