import React, {
	createContext,
	Dispatch,
	useContext,
	useEffect,
	useReducer,
	useState,
} from 'react';
import { getSavedTokens, setSavedTokens, STORAGE_KEY } from '../libs/storage';
import {
	initialState,
	TokensAction,
	tokensReducer,
	TokensState,
} from '../reducer/tokensReducer';
import { Tokens } from '../model';

type TokensContextProps = {
	state: TokensState;
	dispatch: Dispatch<TokensAction>;
};

const TokensContext = createContext<TokensContextProps>({
	state: initialState,
	dispatch: () => initialState,
});

// プロパイダ
export const TokensProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// ユーザ情報の初期値
	const [state, dispatch] = useReducer(tokensReducer, initialState);
	return (
		<TokensContext.Provider value={{ state, dispatch: dispatch }}>
			{children}
		</TokensContext.Provider>
	);
};

export const useTokens = () => useContext(TokensContext);
