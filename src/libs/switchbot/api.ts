import { invoke } from '@tauri-apps/api';
import { Command, Tokens } from '../../model';
import { SwitchBotDevice } from './devices';

// デバイスリストを取得する
export const getDevices = async (
	tokens: Tokens
): Promise<SwitchBotDevice[]> => {
	try {
		return await invoke<SwitchBotDevice[]>('get_devices', {
			tokens: tokens,
		});
	} catch (e) {
		throw e;
	}
};

// 詳細なデバイスリストを取得する
//todo

// デバイスのステータスを取得する
export const getStatus = async (
	tokens: Tokens,
	device_id: string
): Promise<SwitchBotDevice[]> => {
	try {
		return await invoke<SwitchBotDevice[]>('get_status', {
			tokens: tokens,
			deviceId: device_id,
		});
	} catch (e) {
		throw e;
	}
};

// デバイス操作コマンドを送信する
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
		console.log('aaaa');
		console.log(e);
		throw e;
	}
};
