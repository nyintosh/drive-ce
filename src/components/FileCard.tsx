import { useMutation } from 'convex/react';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '@convex/_generated/api';
import { Doc } from '@convex/_generated/dataModel';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Icons } from './Icons';

type FileCardProps = {
	file: Doc<'files'>;
};

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

const FileCard = ({ file }: FileCardProps) => {
	const fileIcons = {
		audio: <Icons.fileAudio className='aspect-square w-4 select-none' />,
		bin: <Icons.fileBin className='aspect-square w-4 select-none' />,
		csv: <Icons.fileCsv className='aspect-square w-4 select-none' />,
		doc: <Icons.fileDoc className='aspect-square w-4 select-none' />,
		docx: <Icons.fileDocx className='aspect-square w-4 select-none' />,
		html: <Icons.fileHtml className='aspect-square w-4 select-none' />,
		image: <Icons.fileImage className='aspect-square w-4 select-none' />,
		json: <Icons.fileJson className='aspect-square w-4 select-none' />,
		pdf: <Icons.filePdf className='aspect-square w-4 select-none' />,
		ppt: <Icons.fileSlides className='aspect-square w-4 select-none' />,
		pptx: <Icons.fileSlides className='aspect-square w-4 select-none' />,
		rar: <Icons.fileZip className='aspect-square w-4 select-none' />,
		txt: <Icons.fileTxt className='aspect-square w-4 select-none' />,
		video: <Icons.fileVideo className='aspect-square w-4 select-none' />,
		xls: <Icons.fileXls className='aspect-square w-4 select-none' />,
		xlsx: <Icons.fileXlsx className='aspect-square w-4 select-none' />,
		xml: <Icons.fileXml className='aspect-square w-4 select-none' />,
		zip: <Icons.fileZip className='aspect-square w-4 select-none' />,
		other: <Icons.file className='aspect-square w-4 select-none' />,
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex w-full items-center justify-between'>
					<span className='flex items-center gap-2'>
						{fileIcons[file.type]}{' '}
						<span className='line-clamp-1'>{file.label}</span>
					</span>{' '}
					<FileAction file={file} />
				</CardTitle>
			</CardHeader>
			<CardFooter>
				<Button variant='outline'>Download</Button>
			</CardFooter>
		</Card>
	);
};

export default FileCard;
