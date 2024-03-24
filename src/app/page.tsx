'use client';

import {
	SignInButton,
	SignedIn,
	SignedOut,
	useOrganization,
	useUser,
} from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import Image from 'next/image';

import { api } from '@convex/_generated/api';

import FileCard from '@/components/FileCard';
import UploadFileModal from '@/components/UploadFileModal';
import { Button } from '@/components/ui/button';

const Home = () => {
	const { organization } = useOrganization();
	const { user } = useUser();

	const orgId = organization?.id ?? user?.id;
	const files = useQuery(api.files.findAll, orgId ? { orgId } : 'skip');

	return (
		<main className='container mx-auto pt-12'>
			<SignedOut>
				<SignInButton>
					<Button variant='outline'>Sign In</Button>
				</SignInButton>
			</SignedOut>

			<SignedIn>
				{files && files.length > 0 ? (
					<>
						<div className='flex items-center justify-between'>
							<h1 className='text-4xl font-bold'>Your Files</h1>
							{orgId ? <UploadFileModal orgId={orgId} /> : null}
						</div>

						<div className='grid grid-cols-4 gap-3 pt-6'>
							{files.map((file) => (
								<FileCard key={file._id} file={file} />
							))}
						</div>
					</>
				) : (
					<div className='mt-12 flex flex-col items-center justify-center gap-6'>
						<Image
							className='grid-cols-4'
							src='/undraw_upload_re_pasx.svg'
							alt='an image of people uploading files'
							width={400}
							height={400}
						/>

						<p className='text-lg text-gray-400'>
							Looks like this space could use some company! Time to spice things
							up with some files!
						</p>

						{orgId ? <UploadFileModal orgId={orgId} /> : null}
					</div>
				)}
			</SignedIn>
		</main>
	);
};

export default Home;
