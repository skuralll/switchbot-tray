import { getSavedTokens, save, setSavedTokens } from '../lib/storage';
import { Tokens } from '../types';

// 各Action
export type TokensAction = { type: 'SET_TOKENS'; tokens: Tokens };

//状態
export type TokensState = {
	tokens: Tokens;
};

// 初期状態
export const initialState: TokensState = {
	tokens: await getSavedTokens(),
};

// Reducer
export const tokensReducer = (
	state: TokensState,
	action: TokensAction
): TokensState => {
	switch (action.type) {
		case 'SET_TOKENS':
			setSavedTokens(action.tokens);
			save();
			return { tokens: action.tokens };
	}
};
