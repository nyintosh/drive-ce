'use client';

import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { HardDriveUpload } from 'lucide-react';
import { useEffect, useState } from 'react';

import { api } from '@convex/_generated/api';

import FileCard from '@/components/FileCard';
import Loader from '@/components/Loader';
import NoFavoritePlaceholder from '@/components/NoFavoritePlaceholder';
import NoFilePlaceholder from '@/components/NoFilePlaceholder';
import NoTrashPlaceholder from '@/components/NoTrashPlaceholder';
import NotFoundPlaceholder from '@/components/NotFoundPlaceholder';
import SearchBar from '@/components/SearchBar';
import UploadFileModal from '@/components/UploadFileModal';
import { Button } from '@/components/ui/button';

type FileExplorerTypes = {
	list?: 'favorites' | 'trash';
};

const FileExplorer = ({ list }: FileExplorerTypes) => {
	const [searchQuery, setSearchQuery] = useState('');

	const { organization } = useOrganization();
	const { user } = useUser();

	const orgId = organization?.id ?? user?.id;
	const files = useQuery(
		api.files.findAll,
		orgId ? { orgId, list, query: searchQuery } : 'skip',
	);

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
						{orgId ? (
							list ? (
								EmptyPlaceHolder[list]
							) : (
								<NoFilePlaceholder orgId={orgId} />
							)
						) : null}
					</div>
				) : (
					<>
						{list === 'trash' ? (
							<div className='mt-8 flex items-center justify-between rounded-md bg-secondary pl-4 text-gray-600'>
								<p className='text-sm'>
									Items in trash will be deleted forever after 30 days
								</p>

								<Button className='my-1 mr-1 hover:bg-input' variant='ghost'>
									Empty trash
								</Button>
							</div>
						) : (
							<div className='sticky top-0 z-50 flex w-full items-center justify-between pt-8'>
								<SearchBar
									setQuery={setSearchQuery}
									query={searchQuery}
									pending={files === undefined}
								/>

								{orgId ? (
									<UploadFileModal orgId={orgId}>
										<HardDriveUpload className='size-4 min-w-4' />
										Upload
									</UploadFileModal>
								) : null}
							</div>
						)}

						<div className='grid grid-cols-4 gap-4 pb-16 pt-4'>
							{files?.map((file) => <FileCard key={file._id} file={file} />)}
						</div>
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

						{orgId ? (
							<UploadFileModal orgId={orgId}>
								<HardDriveUpload className='size-4 min-w-4' />
								Upload
							</UploadFileModal>
						) : null}
					</div>

					{files === undefined ? (
						<Loader />
					) : files.length === 0 ? (
						<NotFoundPlaceholder />
					) : (
						<div className='grid grid-cols-4 gap-4 pb-16 pt-4'>
							{files?.map((file) => <FileCard key={file._id} file={file} />)}
						</div>
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
