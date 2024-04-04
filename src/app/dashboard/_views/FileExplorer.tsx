'use client';

import { Protect, useOrganization, useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { Grid, HardDriveUpload, Table } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@convex/_generated/api';
import { Doc } from '@convex/_generated/dataModel';

import FileCard from '@/app/dashboard/_components/FileCard';
import Loader from '@/components/Loader';
import NoFavoritePlaceholder from '@/components/NoFavoritePlaceholder';
import NoFilePlaceholder from '@/components/NoFilePlaceholder';
import NoTrashPlaceholder from '@/components/NoTrashPlaceholder';
import NotFoundPlaceholder from '@/components/NotFoundPlaceholder';
import SearchBar from '@/components/SearchBar';
import UploadFileModal from '@/components/UploadFileModal';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppContextData, useAppContext } from '@/providers/AppContextProvider';
import { capitalize } from '@/utils/capitalize';

import { columns } from '../_components/FileTable/columns';
import { DataTable } from '../_components/FileTable/data-table';

type FileExplorerTypes = {
	list?: 'favorites' | 'trash';
};

const FileExplorer = ({ list }: FileExplorerTypes) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { user } = useUser();
	const { organization } = useOrganization();

	const orgId = organization?.id ?? user?.id;
	const files = useQuery(
		api.files.findAll,
		orgId ? { orgId, list, query: searchQuery } : 'skip',
	);

	const clearTrash = useMutation(api.files.clearTrash);

	const handleEmptyTrash = () => {
		if (!orgId || !files) return;

		toast.promise(clearTrash({ orgId, fileIds: files.map(({ _id }) => _id) }), {
			loading: 'Clearing trash...',
			success: ({ skipCount }) =>
				skipCount ? 'Cannot clear some item' : 'Trash cleared',
			error: 'Error clearing trash',
		});
	};

	useEffect(() => {
		setSearchQuery('');
	}, [orgId]);

	return (
		<div className='w-full'>
			{!searchQuery ? (
				files === undefined ? (
					<Loader />
				) : files.length === 0 ? (
					<div className='flex flex-col items-center justify-center gap-6 pt-24'>
						{orgId &&
							(list ? (
								EmptyPlaceHolder[list]
							) : (
								<NoFilePlaceholder orgId={orgId} />
							))}
					</div>
				) : (
					<>
						{list === 'trash' ? (
							<div className='mt-8 flex h-[2.75rem] items-center justify-between rounded-md bg-secondary pl-4 text-gray-600'>
								<p className='text-sm'>
									Items in trash will be deleted forever after 30 days
								</p>

								<Protect
									condition={(has) =>
										has({ role: 'org:admin' }) ||
										has({ role: 'org:moderator' }) ||
										user?.id === orgId
									}
								>
									<AlertDialog
										onOpenChange={setIsDialogOpen}
										open={isDialogOpen}
									>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Are you absolutely sure?
												</AlertDialogTitle>
												<AlertDialogDescription>
													This action cannot be undone. This will permanently
													delete all your files.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleEmptyTrash}
													className='bg-red-500 text-white hover:bg-red-600 active:bg-red-400'
												>
													Empty trash
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>

									<Button
										onClick={() => setIsDialogOpen(true)}
										className='my-1 mr-1 text-xs hover:bg-input'
										variant='ghost'
									>
										Empty trash
									</Button>
								</Protect>
							</div>
						) : (
							<div className='sticky top-0 z-50 flex w-full items-center justify-between pt-8'>
								<SearchBar
									setQuery={setSearchQuery}
									query={searchQuery}
									pending={files === undefined}
								/>

								{orgId && (
									<UploadFileModal orgId={orgId}>
										<HardDriveUpload className='size-4 min-w-4' />
										Upload
									</UploadFileModal>
								)}
							</div>
						)}

						<TabsView files={files} />
					</>
				)
			) : (
				<>
					<div className='sticky top-0 z-50 flex w-full items-center justify-between pt-8'>
						<SearchBar
							setQuery={setSearchQuery}
							query={searchQuery}
							pending={files === undefined}
						/>

						{orgId && (
							<UploadFileModal orgId={orgId}>
								<HardDriveUpload className='size-4 min-w-4' />
								Upload
							</UploadFileModal>
						)}
					</div>

					{files === undefined ? (
						<Loader />
					) : files.length === 0 ? (
						<NotFoundPlaceholder />
					) : (
						<TabsView files={files} />
					)}
				</>
			)}
		</div>
	);
};

export default FileExplorer;

const EmptyPlaceHolder = {
	favorites: <NoFavoritePlaceholder />,
	trash: <NoTrashPlaceholder />,
};

const TabsView = ({
	files,
}: {
	files: (Doc<'files'> & { url: string | null })[];
}) => {
	const { setExplorerView, explorerView } = useAppContext();

	const [filter, setFilter] = useState<Doc<'files'>['type'] | undefined>();

	const handleOnFilterChange = (value: string) => {
		setFilter(value !== 'all' ? (value as Doc<'files'>['type']) : undefined);
	};

	const _files = useMemo(() => {
		if (!filter) return files;
		return files.filter((file) => file.type === filter);
	}, [files, filter]);

	return (
		<Tabs
			onValueChange={(value) => {
				setExplorerView(value as AppContextData['explorerView']);
			}}
			defaultValue={explorerView}
			className='pb-[4.25rem]'
		>
			<div className='flex items-start justify-between pt-4'>
				<TabsList>
					<TabsTrigger className='flex items-center gap-1' value='grid'>
						<Grid className='size-4 min-w-4' />
						<span>Grid</span>
					</TabsTrigger>
					<TabsTrigger className='flex items-center gap-1' value='table'>
						<Table className='size-4 min-w-4' />
						<span>Table</span>
					</TabsTrigger>
				</TabsList>

				<div>
					<Select onValueChange={handleOnFilterChange} defaultValue={filter}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='All' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='all'>All</SelectItem>
							{[...new Set(files.map((file) => file.type))]
								.toSorted()
								.map((type) => (
									<SelectItem key={type} value={type}>
										{capitalize(type)}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<TabsContent className='mt-4' value='grid'>
				<div className='grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4'>
					{_files.map((file) => (
						<FileCard key={file._id} file={file} />
					))}
				</div>
			</TabsContent>
			<TabsContent className='mt-4' value='table'>
				<DataTable columns={columns} data={_files} />
			</TabsContent>
		</Tabs>
	);
};
