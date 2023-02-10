import { Store } from 'tauri-plugin-store-api';
import { Tokens } from '../types';

const store = new Store('.settings.dat');
store.load();

export const STORAGE_KEY = {
	TOKENS: 'tokens',
};

// トークンを保存する
export const setSavedTokens = async (tokens: Tokens): Promise<void> => {
	await store.set(STORAGE_KEY.TOKENS, tokens);
};

// 保存データからトークンを取得する
export const getSavedTokens = async (): Promise<Tokens> => {
	return (
		(await store.get<Tokens>(STORAGE_KEY.TOKENS)) || {
			token: '',
			secret: '',
		}
	);
};

export const save = async () => {
	await store.save();
};
