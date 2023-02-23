import { enable, disable } from 'tauri-plugin-autostart-api';
import { getSavedSettings, save, setSavedSettings } from '../libs/storage';
import { Settings } from '../model';

// 各Action
export type SettingsAction = { type: 'SET_SETTINGS'; settings: Settings };

//状態
export type SettingsState = {
	settings: Settings;
};

// 初期状態
export const initialState: SettingsState = {
	settings: await getSavedSettings(),
};

// Reducer
export const SettingsReducer = (
	state: SettingsState,
	action: SettingsAction
): SettingsState => {
	switch (action.type) {
		case 'SET_SETTINGS':
			// 保存処理
			setSavedSettings(action.settings);
			save();
			// 各設定に依存する処理
			action.settings.autostart ? enable() : disable(); // 自動起動の有効/無効化
			return { settings: action.settings };
	}
};
