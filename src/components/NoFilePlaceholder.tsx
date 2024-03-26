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
				className='select-none grid-cols-4'
				src='/undraw_upload.svg'
				alt='an image of people uploading files'
				width={400}
				height={400}
			/>

			<p className='text-lg text-gray-400'>
				Looks like this space could use some company! Time to spice things up
				with some files!
			</p>

			<UploadFileModal orgId={orgId}>
				<HardDriveUpload className='aspect-square min-w-4' size={16} />
				Upload
			</UploadFileModal>
		</div>
	);
};

export default NoFilePlaceholder;
