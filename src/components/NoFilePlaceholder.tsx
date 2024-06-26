import { HardDriveUpload } from 'lucide-react';
import Image from 'next/image';

import UploadFileModal from './UploadFileModal';

type NoFilePlaceholderProps = {
	orgId: string;
};

const NoFilePlaceholder = ({ orgId }: NoFilePlaceholderProps) => {
	return (
		<div className='flex flex-col items-center justify-center gap-6'>
			<Image
				className='h-72 w-auto select-none grid-cols-4'
				src='/assets/undraw_upload.svg'
				alt='an image of people uploading files'
				width={400}
				height={400}
			/>

			<p className='max-w-96 text-center text-gray-500'>
				Looks like this space could use some company! Time to spice things up
				with some files!
			</p>

			<UploadFileModal orgId={orgId}>
				<HardDriveUpload className='size-4 min-w-4' size={16} />
				Upload
			</UploadFileModal>
		</div>
	);
};

export default NoFilePlaceholder;
