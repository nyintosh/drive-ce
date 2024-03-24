'use client';

import {
	SignInButton,
	SignedIn,
	SignedOut,
	useOrganization,
	useUser,
} from '@clerk/nextjs';
import { useQuery } from 'convex/react';

import { api } from '@convex/_generated/api';

import UploadFileModal from '@/components/UploadFileModal';
import { Button } from '@/components/ui/button';

const Home = () => {
	const { organization } = useOrganization();
	const { user } = useUser();

	const orgId = organization?.id ?? user?.id;
	const files = useQuery(api.files.find, orgId ? { orgId } : 'skip');

	return (
		<main className='container mx-auto pt-12'>
			<SignedOut>
				<SignInButton>
					<Button variant='outline'>Sign In</Button>
				</SignInButton>
			</SignedOut>

			<SignedIn>
				<div className='flex items-center justify-between'>
					<h1 className='text-4xl font-bold'>Your Files</h1>
					{orgId ? <UploadFileModal orgId={orgId} /> : null}
				</div>

				<div className='pt-6'>
					{files?.map((file) => (
						<div key={file._id}>
							<p className='font-mono'>{file.label}</p>
						</div>
					))}
				</div>
			</SignedIn>
		</main>
	);
};

export default Home;
