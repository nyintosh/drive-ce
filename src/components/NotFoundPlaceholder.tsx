import Image from 'next/image';

const NotFoundPlaceholder = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-6 py-[10vh]'>
			<Image
				className='h-52 w-auto select-none grid-cols-4'
				src='/assets/undraw_page_not_found.svg'
				alt='an image of people uploading files'
				width={300}
				height={300}
			/>

			<p className={'text-sm text-gray-400'}>Not found</p>
		</div>
	);
};

export default NotFoundPlaceholder;
