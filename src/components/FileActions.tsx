import { Protect } from '@clerk/nextjs';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { useMutation } from 'convex/react';
import {
	EllipsisVertical,
	ExternalLink,
	Star,
	Trash,
	Trash2,
	Undo,
} from 'lucide-react';
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
} from './ui/alert-dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';

type FileActionsProps = {
	file: Doc<'files'> & { url: string | null };
	isAuthor: boolean;
	isFavorited: boolean;
	isTrash: boolean;
};

export const FileActions = ({
	file,
	isAuthor,
	isFavorited,
	isTrash,
}: FileActionsProps) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const toggleFavorite = useMutation(api.files.toggleFavorite);
	const markForDelete = useMutation(api.files.markForDelete);
	const restore = useMutation(api.files.restore);
	const hardDelete = useMutation(api.files.remove);

	const handleOpenInNewTab = () => {
		if (!file.url) return;
		window.open(file.url, '_blank');
	};

	const handleToggleFavorite = async () => {
		await toggleFavorite({ fileId: file._id });
	};

	const handleMoveToTrash = () => {
		toast.promise(async () => await markForDelete({ fileId: file._id }), {
			loading: '',
			success: 'File moved to trash',
			error: (error) => error?.data || 'Oops! Something went wrong',
		});
	};

	const handleFileRestore = () => {
		toast.promise(async () => await restore({ fileId: file._id }), {
			loading: '',
			success: 'File restored',
			error: (error) => error?.data || 'Oops! Something went wrong',
		});
	};

	const handleHardDelete = () => {
		toast.promise(async () => await hardDelete({ fileId: file._id }), {
			loading: '',
			success: 'File deleted',
			error: (error) => error?.data || 'Oops! Something went wrong',
		});
	};

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
							onClick={handleHardDelete}
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
						onClick={handleOpenInNewTab}
						className='flex cursor-pointer items-center gap-2 pl-3 pr-4'
					>
						<ExternalLink className='size-4 min-w-4' /> Open in new tab
					</DropdownMenuItem>
					{!isTrash && (
						<DropdownMenuItem
							onClick={handleToggleFavorite}
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
					)}

					<Protect
						condition={(has) =>
							has({ role: 'org:admin' }) ||
							has({ role: 'org:moderator' }) ||
							isAuthor
						}
					>
						<>
							<DropdownMenuSeparator />
							{isTrash ? (
								<>
									<DropdownMenuItem
										onClick={handleFileRestore}
										className='flex cursor-pointer items-center gap-2 pl-3 pr-4 text-cyan-500 focus:text-cyan-600 active:text-cyan-400'
									>
										<Undo className='size-4 min-w-4' /> Restore
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => setIsDialogOpen(true)}
										className='flex cursor-pointer items-center gap-2 pl-3 pr-4 text-red-500 focus:text-red-600 active:text-red-400'
									>
										<Trash2 className='size-4 min-w-4' /> Delete now
									</DropdownMenuItem>
								</>
							) : (
								<DropdownMenuItem
									onClick={handleMoveToTrash}
									className='flex cursor-pointer items-center gap-2 pl-3 pr-4 text-red-500 focus:text-red-600 active:text-red-400'
								>
									<Trash className='size-4 min-w-4' /> Move to trash
								</DropdownMenuItem>
							)}
						</>
					</Protect>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
