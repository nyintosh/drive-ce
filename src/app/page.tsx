'use client';

import { useAppContext } from '@/providers/AppContextProvider';
import Link from 'next/link';

const Home = () => {
	const { signedUser } = useAppContext();

	return (
		<div className='relative' id='home'>
			<div
				aria-hidden='true'
				className='absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20'
			>
				<div className='h-56 bg-gradient-to-br from-primary to-purple-400 blur-[106px] dark:from-blue-700'></div>
				<div className='h-32 bg-gradient-to-r from-cyan-400 to-sky-300 blur-[106px] dark:to-indigo-600'></div>
			</div>
			<div className='mx-auto max-w-7xl px-6 md:px-12 xl:px-6'>
				<div className='relative ml-auto pt-36'>
					<div className='mx-auto text-center lg:w-2/3'>
						<h1 className='text-5xl font-bold text-gray-900 dark:text-white md:text-6xl xl:text-7xl'>
							The simplest way to{' '}
							<span className='text-primary dark:text-white'>store</span> and{' '}
							<span className='text-primary dark:text-white'>share</span> files
							with your folks
						</h1>
						<p className='mt-8 text-gray-700 dark:text-gray-300'>
							Simplify your file storage and sharing effortlessly. With our
							user-friendly platform, sharing files with your connections has
							never been easier. Say goodbye to complexity and hello to
							simplicity. Start sharing hassle-free today!
						</p>
						<div className='mt-16 flex flex-wrap justify-center gap-x-6 gap-y-4'>
							<Link href='/dashboard'>
								<div className='relative flex h-11 w-full cursor-pointer items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max'>
									<span className='relative text-base font-semibold text-white'>
										{!signedUser ? 'Get Started' : 'Go to Dashboard'}
									</span>
								</div>
							</Link>
						</div>
						<div className='mt-16 hidden justify-between border-y border-gray-100 py-8 dark:border-gray-800 sm:flex'>
							<div className='text-left'>
								<h6 className='text-lg font-semibold text-gray-700 dark:text-white'>
									Simplicity
								</h6>
								<p className='mt-2 text-gray-500'>
									Our platform&apos;s straightforward interface ensures
									effortless file storage and sharing, perfect for users of all
									levels.
								</p>
							</div>
							<div className='text-left'>
								<h6 className='text-lg font-semibold text-gray-700 dark:text-white'>
									Accessibility
								</h6>
								<p className='mt-2 text-gray-500'>
									Access your files from anywhere, anytime with our cloud-based
									storage solution, ensuring convenience and flexibility.
								</p>
							</div>
							<div className='text-left'>
								<h6 className='text-lg font-semibold text-gray-700 dark:text-white'>
									Intuitiveness
								</h6>
								<p className='mt-2 text-gray-500'>
									Navigate and manage files effortlessly with our user-friendly
									design, making organization and sharing a breeze.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
