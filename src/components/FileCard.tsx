import { useMutation, useQuery } from 'convex/react';
import { EllipsisVertical, ExternalLink, Trash2 } from 'lucide-react';
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
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

const fileIcons = {
	audio: (className?: string) => (
		<Icons.fileAudio
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	bin: (className?: string) => (
		<Icons.fileBin
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	csv: (className?: string) => (
		<Icons.fileCsv
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	doc: (className?: string) => (
		<Icons.fileDoc
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	docx: (className?: string) => (
		<Icons.fileDocx
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	html: (className?: string) => (
		<Icons.fileHtml
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	image: (className?: string) => (
		<Icons.fileImage
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	json: (className?: string) => (
		<Icons.fileJson
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	pdf: (className?: string) => (
		<Icons.filePdf
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	ppt: (className?: string) => (
		<Icons.fileSlides
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	pptx: (className?: string) => (
		<Icons.fileSlides
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	rar: (className?: string) => (
		<Icons.fileZip
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	txt: (className?: string) => (
		<Icons.fileTxt
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	video: (className?: string) => (
		<Icons.fileVideo
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	xls: (className?: string) => (
		<Icons.fileXls
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	xlsx: (className?: string) => (
		<Icons.fileXlsx
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	xml: (className?: string) => (
		<Icons.fileXml
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	zip: (className?: string) => (
		<Icons.fileZip
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
	other: (className?: string) => (
		<Icons.file
			className={cn(`aspect-square w-4 cursor-none select-none`, className)}
		/>
	),
};

type FileCardProps = {
	file: Doc<'files'> & {
		url: string | null;
	};
};

const FileCard = ({ file }: FileCardProps) => {
	const user = useQuery(api.users.getUserById, { id: file.authorId });

	return (
		<Card>
			<CardHeader className='p-4'>
				<CardTitle className='flex w-full items-center justify-between'>
					<span className='flex items-center gap-2'>
						{fileIcons[file.type]()}{' '}
						<span className='line-clamp-1 text-sm text-gray-600'>
							{file.label}
						</span>
					</span>{' '}
					<FileAction file={file} />
				</CardTitle>
			</CardHeader>
			<CardContent className='p-4 pt-0'>
				{file.type === 'image' && file.url ? (
					<Image
						className='aspect-video h-auto w-full rounded-md object-cover'
						src={file.url}
						alt={file.label}
						width={200}
						height={100}
					/>
				) : (
					<div className='grid aspect-video h-auto w-full place-items-center'>
						{fileIcons[file.type]('scale-[300%]')}
					</div>
				)}
			</CardContent>
			<CardFooter className='p-4 pt-0'>
				<p className='flex items-center gap-3'>
					<Avatar className='h-6 w-6'>
						<AvatarImage src={user?.imageUrl} alt={user?.name} />
						<AvatarFallback>{user?.name[0]}</AvatarFallback>
					</Avatar>
					<span>•</span>
					<span className='line-clamp-1 text-xs'>
						{formatDateOrTimeAgo(new Date(file._creationTime))}
					</span>
				</p>
			</CardFooter>
		</Card>
	);
};

export default FileCard;

const FileAction = ({ file }: FileCardProps) => {
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

	const deleteFile = useMutation(api.files.deleteFile);

	return (
		<>
			<AlertDialog
				onOpenChange={setIsConfirmDialogOpen}
				open={isConfirmDialogOpen}
			>
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
								toast.promise(
									async () => {
										await deleteFile({ fileId: file._id });
									},
									{
										loading: 'Deleting file...',
										success: 'File deleted',
										error: 'Error deleting file',
									},
								);
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
					<EllipsisVertical className='aspect-square min-w-4' size={16} />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={() => {
							if (!file.url) return;
							window.open(file.url, '_blank');
						}}
						className='flex cursor-pointer items-center gap-2 pl-3 pr-4'
					>
						<ExternalLink className='aspect-square min-w-4' size={16} /> Open
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setIsConfirmDialogOpen(true)}
						className='flex cursor-pointer items-center gap-2 pl-3 pr-4 text-red-500 focus:text-red-600 active:text-red-400'
					>
						<Trash2 className='aspect-square min-w-4' size={16} /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
