import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Input } from './ui/input';

const formSchema = z.object({
	query: z.string(),
});

type SearchBarProps = {
	setQuery: Dispatch<SetStateAction<string>>;
	query: string;
	className?: string;
	pending?: boolean;
};

const SearchBar = ({ setQuery, query, className, pending }: SearchBarProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			query,
		},
	});

	const handleSearch = (values: z.infer<typeof formSchema>) => {
		setQuery(values.query);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSearch)}
				className={cn('flex items-center gap-2', className)}
			>
				<FormField
					control={form.control}
					name='query'
					render={({ field }) => (
						<FormItem className='relative'>
							<FormControl>
								<Input
									className='bg-white'
									placeholder='Aa.'
									{...field}
									disabled={pending}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button variant='outline' type='submit' disabled={pending}>
					<Search className='size-4 min-w-4' />
				</Button>
			</form>
		</Form>
	);
};

export default SearchBar;
