import { Loader2 } from 'lucide-react';

const Loader = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-1 pt-[calc(30vh-1.25rem)] text-gray-500'>
			<Loader2 className='aspect-square min-w-4 animate-spin' size={16} />
			<p className='animate-pulse text-sm'>Loading...</p>
		</div>
	);
};

export default Loader;
