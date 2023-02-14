import { invoke } from '@tauri-apps/api';
import { TDevice, Tokens } from '../model';

// デバイスリストを取得する
export const getDevices = async (tokens: Tokens): Promise<TDevice[]> => {
	try {
		return await invoke<TDevice[]>('get_devices', {
			tokens: tokens,
		});
	} catch (e) {
		throw e;
	}
};
