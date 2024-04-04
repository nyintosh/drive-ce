'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import {
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from 'react';

import { api } from '@convex/_generated/api';
import { Doc } from '@convex/_generated/dataModel';

export type AppContextData = {
	setExplorerView: Dispatch<SetStateAction<AppContextData['explorerView']>>;
	explorerView: 'grid' | 'table';
	signedUser: Doc<'users'> | undefined;
};

const AppContext = createContext<AppContextData>({
	setExplorerView: () => {},
	explorerView: 'grid',
	signedUser: undefined,
});

const AppContextProvider = ({ children }: PropsWithChildren) => {
	const [explorerView, setExplorerView] =
		useState<AppContextData['explorerView']>('grid');

	const { user } = useUser();
	const userInfo = useQuery(
		api.users.findUserByAuthId,
		user?.id ? { id: user.id } : 'skip',
	);

	return (
		<AppContext.Provider
			value={{
				setExplorerView,
				explorerView,
				signedUser: userInfo,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);
