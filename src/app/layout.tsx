import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import AppContextProvider from '@/providers/AppContextProvider';
import ConvexClientProvider from '@/providers/ConvexClientProvider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'DRIVE (CE)',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<ConvexClientProvider>
					<AppContextProvider>
						<>{children}</>
					</AppContextProvider>

					<Toaster richColors theme='light' />
				</ConvexClientProvider>
			</body>
		</html>
	);
}
