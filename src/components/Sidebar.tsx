'use client';

import { StarFilledIcon } from '@radix-ui/react-icons';
import { File, Files, Star, Trash, Trash2 } from 'lucide-react';
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
					{isActive('/dashboard') ? (
						<Files className='size-4 min-w-4' />
					) : (
						<File className='size-4 min-w-4' />
					)}{' '}
					Your files
				</Button>
			</Link>

			<Link href='/dashboard/favorites'>
				<Button
					className='flex w-full items-center justify-start gap-2'
					variant={isActive('/dashboard/favorites') ? 'secondary' : 'ghost'}
				>
					{isActive('/dashboard/favorites') ? (
						<StarFilledIcon className='size-4 min-w-4' />
					) : (
						<Star className='size-4 min-w-4' />
					)}{' '}
					Favorites
				</Button>
			</Link>

			<Link href='/dashboard/trash'>
				<Button
					className='flex w-full items-center justify-start gap-2'
					variant={isActive('/dashboard/trash') ? 'secondary' : 'ghost'}
				>
					{isActive('/dashboard/trash') ? (
						<Trash2 className='size-4 min-w-4' />
					) : (
						<Trash className='size-4 min-w-4' />
					)}{' '}
					Trash
				</Button>
			</Link>
		</div>
	);
};

export default Sidebar;
