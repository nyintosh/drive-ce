'use client';

import {
	SignInButton,
	SignedIn,
	SignedOut,
	useOrganization,
	useUser,
} from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';

import { api } from '@convex/_generated/api';

import { Button } from '@/components/ui/button';

export default function Home() {
	const { organization } = useOrganization();
	const { user } = useUser();

	const createFile = useMutation<typeof api.files.create>(api.files.create);

	const orgId = organization?.id ?? user?.id;
	const files = useQuery(api.files.find, orgId ? { orgId } : 'skip');

	return (
		<main className='grid h-[calc(100vh-3.5rem)] place-items-center pb-14'>
			<SignedOut>
				<SignInButton>
					<Button variant='outline'>Sign In</Button>
				</SignInButton>
			</SignedOut>

			<SignedIn>
				<div className='flex w-full items-center'>
					<div className='flex w-1/2 flex-col items-center justify-center'>
						{files?.map((file) => (
							<div key={file._id}>
								<p className='font-mono'>{file.label}</p>
							</div>
						))}
					</div>

					<div className='grid w-1/2 place-items-center'>
						<Button
							onClick={() => {
								if (!orgId) return;

								createFile({
									label: `[::${Date.now()}]`,
									orgId,
								});
							}}
						>
							Create File
						</Button>
					</div>
				</div>
			</SignedIn>
		</main>
	);
}
