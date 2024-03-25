'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { CloudUpload, Loader2 } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { api } from '@convex/_generated/api';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
	label: z
		.string()
		.min(2, {
			message: 'File name must contain at least 2 character(s)',
		})
		.max(200, {
			message: 'File name cannot be longer than 200 characters',
		}),
	file: z.any().refine((files) => files.length > 0, {
		message: 'You need to select a file',
	}),
});

type UploadFileModalProps = {
	orgId: string;
};

const UploadFileModal = ({ orgId }: UploadFileModalProps) => {
	const [isUploading, setIsUploading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			label: '',
		},
	});
	const fileRef = form.register('file');

	const generateUploadUrl = useMutation(api.files.generateUploadUrl);
	const createFile = useMutation(api.files.createFile);

	const handleFileChange = (files: FileList | null) => {
		const selectedFile = files?.[0];

		if (selectedFile) {
			form.setValue('label', selectedFile.name);
			form.trigger('label');
		}
	};

	const handleFileUpload = (values: z.infer<typeof formSchema>) => {
		toast.promise(
			async () => {
				setIsUploading(true);

				const postUrl = await generateUploadUrl();
				const result = await fetch(postUrl, {
					method: 'POST',
					headers: { 'Content-Type': values.file[0].type },
					body: values.file[0],
				});

				const { storageId } = await result.json();
				await createFile({ label: values.label, fileId: storageId, orgId });
			},
			{
				loading: 'Uploading file...',
				success: 'File uploaded',
				error: 'Error uploading file',
				finally: () => {
					setIsUploading(false);
					setIsModalOpen(false);
				},
			},
		);
	};

	return (
		<Dialog
			onOpenChange={(isOpen) => {
				form.reset();
				setIsModalOpen(isOpen);
			}}
			open={isModalOpen}
		>
			<DialogTrigger asChild>
				<Button className='flex items-center gap-2 pl-3 pr-4'>
					<CloudUpload className='aspect-square min-w-4' size={16} /> File
					upload
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle className='mb-5 flex items-center gap-2'>
						Select a file to upload
					</DialogTitle>

					<DialogDescription>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(handleFileUpload)}
								className='space-y-4'
							>
								<FormField
									control={form.control}
									name='label'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input placeholder='File name' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='file'
									render={({ field: { onChange } }) => (
										<FormItem>
											<FormLabel>File</FormLabel>
											<FormControl className='pl-[0.375rem] pt-[0.375rem] text-[0.625rem]'>
												<Input
													type='file'
													{...fileRef}
													onChange={(ev: ChangeEvent<HTMLInputElement>) => {
														const files = ev.target.files;
														onChange(files);
														handleFileChange(files);
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									className='!mt-8 flex items-center gap-2 pl-3 pr-4'
									type='submit'
									disabled={isUploading}
								>
									{!isUploading ? (
										<>
											<CloudUpload
												className='aspect-square min-w-4'
												size={16}
											/>
											Upload
										</>
									) : (
										<>
											<Loader2
												className='aspect-square min-w-4 animate-spin'
												size={16}
											/>
											Uploading...
										</>
									)}
								</Button>
							</form>
						</Form>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default UploadFileModal;