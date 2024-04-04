import { SignInButton, SignedOut } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Button } from '@/components/ui/button';
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
						<SignedOut>
							<main className='grid h-screen w-screen place-items-center'>
								<SignInButton>
									<Button variant='outline'>Sign In</Button>
								</SignInButton>
							</main>
						</SignedOut>

						{children}
					</AppContextProvider>

					<Toaster richColors theme='light' />
				</ConvexClientProvider>
			</body>
		</html>
	);
}
