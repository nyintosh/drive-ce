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
import NotFoundPlaceholder from '@/components/NotFoundPlaceholder';
import SearchBar from '@/components/SearchBar';
import UploadFileModal from '@/components/UploadFileModal';

type FileExplorerTypes = {
	isFavorite?: boolean;
};

const FileExplorer = ({ isFavorite }: FileExplorerTypes) => {
	const [searchQuery, setSearchQuery] = useState('');

	const { organization } = useOrganization();
	const { user } = useUser();

	const orgId = organization?.id ?? user?.id;
	const files = useQuery(
		api.files.findAll,
		orgId ? { orgId, isFavorite, query: searchQuery } : 'skip',
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
							isFavorite ? (
								<NoFavoritePlaceholder />
							) : (
								<NoFilePlaceholder orgId={orgId} />
							)
						) : null}
					</div>
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

						<div className='grid grid-cols-4 gap-3 pb-16 pt-4'>
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
						<div className='grid grid-cols-4 gap-3 pb-16 pt-4'>
							{files?.map((file) => <FileCard key={file._id} file={file} />)}
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default FileExplorer;
