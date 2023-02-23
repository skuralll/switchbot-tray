import { enable, disable } from 'tauri-plugin-autostart-api';
import { Store } from 'tauri-plugin-store-api';
import { Settings, Tokens } from '../model';

const store = new Store('.settings.dat');
store.load();

export const STORAGE_KEY = {
	TOKENS: 'tokens',
	SETTINGS: 'settings',
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

// 設定ファイルを保存する
export const setSavedSettings = async (settings: Settings): Promise<void> => {
	await store.set(STORAGE_KEY.SETTINGS, settings);
};

// 設定ファイルを取得する
export const getSavedSettings = async (): Promise<Settings> => {
	const settings = await store.get<Settings>(STORAGE_KEY.SETTINGS);
	if (settings == null) {
		await enable();
		return {
			autostart: true,
		};
	} else {
		return settings;
	}
};

export const save = async () => {
	await store.save();
};
