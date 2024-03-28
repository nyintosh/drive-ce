import { Files } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from './ui/button';

const NoFavoritePlaceholder = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-6'>
			<Image
				className='h-72 w-auto select-none grid-cols-4'
				src='/assets/undraw_inbox.svg'
				alt='an image of people uploading files'
				width={400}
				height={400}
			/>

			<p className='text-lg text-gray-400'>
				Looks like your favorites list is feeling a bit empty. Time to add
				something special!
			</p>

			<Link href='/dashboard'>
				<Button className='flex items-center gap-2'>
					<Files className='size-4 min-w-4' /> Browse Files
				</Button>
			</Link>
		</div>
	);
};

export default NoFavoritePlaceholder;
