'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Home = () => {
	const { user } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!user) return;
		router.replace('/dashboard');
	}, [user, router]);
};

export default Home;
