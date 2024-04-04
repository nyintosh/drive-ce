import { useQuery } from 'convex/react';
import Image from 'next/image';

import { api } from '@convex/_generated/api';
import { Doc } from '@convex/_generated/dataModel';

import { FileActions } from '@/components/FileActions';
import { Icons } from '@/components/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	formatHourLeft,
	formatRelativeOrDistanceToNow,
} from '@/lib/formatDate';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/providers/AppContextProvider';

type FileCardProps = {
	file: Doc<'files'> & { url: string | null };
};

const FileCard = ({ file }: FileCardProps) => {
	const { signedUser } = useAppContext();

	const author = useQuery(api.users.findUserById, { id: file.authorId });

	const isAuthor = signedUser?._id === file.authorId;

	const isFavorited = useQuery(
		api.files.checkIfFavorited,
		signedUser?._id ? { fileId: file._id, userId: signedUser?._id } : 'skip',
	);

	const deleteBy = useQuery(
		api.users.findUserById,
		file.deleteBy ? { id: file.deleteBy } : 'skip',
	);

	return (
		<Card className='relative'>
			{!!file.scheduleDeleteAt && (
				<p className='absolute -bottom-[0.875rem] left-1/2 -z-10 w-max -translate-x-1/2 rounded-b-sm bg-amber-400 px-1.5 pb-0.5 text-[0.5rem]'>
					{deleteBy?._id === signedUser?._id ? 'You' : deleteBy?.name} •{' '}
					{file.scheduleDeleteAt >= Date.now() ? (
						<>
							{formatHourLeft(new Date(file.scheduleDeleteAt))} left to recover
						</>
					) : (
						<span>will be deleted at any moment</span>
					)}
				</p>
			)}

			<CardHeader className='p-4'>
				<CardTitle className='flex items-center justify-between'>
					<span className='flex w-[calc(100%-1.25rem)] items-center gap-2'>
						{fileIcons[file.type]()}{' '}
						<span className='line-clamp-1 text-sm text-gray-600'>
							{file.label}
						</span>
					</span>

					<FileActions
						file={file}
						isAuthor={isAuthor}
						isFavorited={!!isFavorited}
						isTrash={!!deleteBy}
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
						{formatRelativeOrDistanceToNow(new Date(file._creationTime))}
					</span>
				</p>
			</CardFooter>
		</Card>
	);
};

export default FileCard;

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
