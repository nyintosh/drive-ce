'use client';

import { File, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from './ui/button';

const Sidebar = () => {
	const pathname = usePathname();
	const isActive = (path: string) => pathname === path;

	return (
		<div className='sticky top-0 flex h-max w-40 min-w-40 flex-col gap-2 py-8'>
			<Link href='/dashboard'>
				<Button
					className='flex w-full items-center justify-start gap-2'
					variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
				>
					<File className='size-4 min-w-4' /> Your files
				</Button>
			</Link>

			<Link href='/dashboard/favorites'>
				<Button
					className='flex w-full items-center justify-start gap-2'
					variant={isActive('/dashboard/favorites') ? 'secondary' : 'ghost'}
				>
					<Star className='size-4 min-w-4' /> Favorites
				</Button>
			</Link>
		</div>
	);
};

export default Sidebar;
