import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Header from '@/components/Header';
import ConvexClientProvider from '@/providers/ConvexClientProvider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Drive (CE)',
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
					<Header />
					{children}
				</ConvexClientProvider>
			</body>
		</html>
	);
}
