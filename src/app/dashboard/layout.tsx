import type { Metadata } from 'next';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
	title: 'DRIVE (CE) - Dashboard',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Header />

			<main className='container relative mx-auto h-[calc(100vh-3.5rem)]'>
				<div className='flex gap-4'>
					<Sidebar />
					{children}
				</div>
			</main>
		</>
	);
}
