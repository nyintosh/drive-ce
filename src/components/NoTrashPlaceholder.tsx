import Image from 'next/image';

const NoTrashPlaceholder = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-6'>
			<Image
				className='h-72 w-auto select-none grid-cols-4'
				src='/assets/undraw_throw_away.svg'
				alt='an image of people uploading files'
				width={400}
				height={400}
			/>

			<h3 className='text-2xl'>Nothing in trash</h3>

			<p className='-mt-4 max-w-96 text-center text-gray-500'>
				Move items you don&apos;t need to trash. Items in trash will be deleted
				forever after 30 days.
			</p>
		</div>
	);
};

export default NoTrashPlaceholder;
