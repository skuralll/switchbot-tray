import { invoke } from '@tauri-apps/api';
import { Command, TDevice, Tokens } from '../model';

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

export const sendCommand = async (
	tokens: Tokens,
	command: Command
): Promise<string> => {
	try {
		return await invoke<string>('send_command', {
			tokens: tokens,
			command: command,
		});
	} catch (e) {
		throw e;
	}
};
