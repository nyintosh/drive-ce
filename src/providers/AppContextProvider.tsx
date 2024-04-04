'use client';

import {
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	createContext,
	useContext,
	useState,
} from 'react';

export type AppContextData = {
	setExplorerView: Dispatch<SetStateAction<AppContextData['explorerView']>>;
	explorerView: 'grid' | 'table';
};

const AppContext = createContext<AppContextData>({
	setExplorerView: () => {},
	explorerView: 'grid',
});

const AppContextProvider = ({ children }: PropsWithChildren) => {
	const [explorerView, setExplorerView] =
		useState<AppContextData['explorerView']>('grid');

	return (
		<AppContext.Provider
			value={{
				setExplorerView,
				explorerView,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);
