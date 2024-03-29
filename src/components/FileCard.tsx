import { Protect, useUser } from '@clerk/nextjs';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from 'convex/react';
import { EllipsisVertical, ExternalLink, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '@convex/_generated/api';
import { Doc } from '@convex/_generated/dataModel';

import { formatDateOrTimeAgo } from '@/lib/formatDateOrTimeAgo';
import { cn } from '@/lib/utils';

import { Icons } from './Icons';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from './ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

type FileCardProps = {
	file: Doc<'files'> & {
		url: string | null;
	};
};

const FileCard = ({ file }: FileCardProps) => {
	const { user } = useUser();

	const author = useQuery(api.users.findUserById, { id: file.authorId });
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

	return (
		<Card>
			<CardHeader className='p-4'>
				<CardTitle className='flex items-center justify-between'>
					<span className='flex w-[calc(100%-1.25rem)] items-center gap-2'>
						{fileIcons[file.type]()}{' '}
						<span className='line-clamp-1 text-sm text-gray-600'>
							{file.label}
						</span>
					</span>

					<FileAction
						file={file}
						isAuthor={isAuthor}
						isFavorited={!!isFavorited}
					/>
				</CardTitle>
			</CardHeader>
			<CardContent className='p-4 pt-0'>
				{file.type === 'image' && file.url ? (
					<Image
						className='aspect-[16/10] h-auto w-full rounded-md border object-cover shadow-sm'
						src={file.url}
						alt={file.label}
						width={200}
						height={100}
					/>
				) : (
					<div className='flex aspect-[16/10] h-auto w-full flex-col items-center justify-center gap-1'>
						{fileIcons[file.type]('size-10')}
						<span className='text-[0.625rem] font-bold text-gray-400'>
							{file.type.toUpperCase()}
						</span>
					</div>
				)}
			</CardContent>
			<CardFooter className='p-4 pt-0'>
				<p className='flex items-center gap-2 text-xs'>
					<div className='flex items-center gap-2'>
						<Avatar className='size-5 min-w-5'>
							<AvatarImage src={author?.imageUrl} alt={author?.name} />
							<AvatarFallback>{author?.name[0]}</AvatarFallback>
						</Avatar>
						<span className='line-clamp-1'>
							{isAuthor ? 'You' : author?.name}
						</span>
					</div>
					<span>•</span>
					<span className='line-clamp-1'>
						{formatDateOrTimeAgo(new Date(file._creationTime))}
					</span>
				</p>
			</CardFooter>
		</Card>
	);
};

export default FileCard;

const FileAction = ({
	file,
	isAuthor,
	isFavorited,
}: FileCardProps & { isAuthor: boolean; isFavorited: boolean }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const toggleFavorite = useMutation(api.files.toggleFavorite);
	const remove = useMutation(api.files.remove);

	return (
		<>
			<AlertDialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							file.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								toast.promise(async () => await remove({ fileId: file._id }), {
									loading: 'Deleting file...',
									success: 'File deleted',
									error: (error) => error?.data || 'Error deleting file',
								});
							}}
							className='bg-red-500 text-white hover:bg-red-600 active:bg-red-400'
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<DropdownMenu>
				<DropdownMenuTrigger>
					<EllipsisVertical className='size-4 min-w-4' />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={() => {
							if (!file.url) return;
							window.open(file.url, '_blank');
						}}
						className='flex cursor-pointer items-center gap-2 pl-3 pr-4'
					>
						<ExternalLink className='size-4 min-w-4' /> Open
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => toggleFavorite({ fileId: file._id })}
						className='flex cursor-pointer items-center gap-2 pl-3 pr-4'
					>
						{isFavorited ? (
							<>
								<StarFilledIcon className='size-4 min-w-4' /> Unfavourite
							</>
						) : (
							<>
								<Star className='size-4 min-w-4' /> Favorite
							</>
						)}
					</DropdownMenuItem>

					<Protect
						condition={(has) =>
							has({ role: 'org:admin' }) ||
							has({ role: 'org:moderator' }) ||
							isAuthor
						}
					>
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => setIsDialogOpen(true)}
								className='flex cursor-pointer items-center gap-2 pl-3 pr-4 text-red-500 focus:text-red-600 active:text-red-400'
							>
								<Trash2 className='size-4 min-w-4' /> Delete
							</DropdownMenuItem>
						</>
					</Protect>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export const fileIcons = {
	audio: (className?: string) => (
		<Icons.fileAudio className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	bin: (className?: string) => (
		<Icons.fileBin className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	csv: (className?: string) => (
		<Icons.fileCsv className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	doc: (className?: string) => (
		<Icons.fileDoc className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	docx: (className?: string) => (
		<Icons.fileDocx className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	html: (className?: string) => (
		<Icons.fileHtml className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	image: (className?: string) => (
		<Icons.fileImage className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	json: (className?: string) => (
		<Icons.fileJson className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	pdf: (className?: string) => (
		<Icons.filePdf className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	ppt: (className?: string) => (
		<Icons.fileSlides className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	pptx: (className?: string) => (
		<Icons.fileSlides className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	rar: (className?: string) => (
		<Icons.fileZip className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	txt: (className?: string) => (
		<Icons.fileTxt className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	video: (className?: string) => (
		<Icons.fileVideo className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	xls: (className?: string) => (
		<Icons.fileXls className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	xlsx: (className?: string) => (
		<Icons.fileXlsx className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	xml: (className?: string) => (
		<Icons.fileXml className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	zip: (className?: string) => (
		<Icons.fileZip className={cn(`size-4 min-w-4 select-none`, className)} />
	),
	other: (className?: string) => (
		<Icons.file className={cn(`size-4 min-w-4 select-none`, className)} />
	),
};
