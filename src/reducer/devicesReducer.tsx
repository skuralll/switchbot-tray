import { getDevices } from '../libs/switchbot/switchbot';
import { SwitchBotDevice } from '../libs/switchbot/devices';

// 各Aアクション
export type DevicesAction = { type: 'SET_DEVICES'; devices: SwitchBotDevice[] };

// デバイスリストの状態
export type DevicesState = {
	devices: SwitchBotDevice[];
};

// デバイスリストの初期状態
export const initialState: DevicesState = {
	devices: [],
};

// デバイスリストのReducer
export const devicesReducer = (
	state: DevicesState,
	action: DevicesAction
): DevicesState => {
	switch (action.type) {
		case 'SET_DEVICES':
			return { devices: action.devices };
	}
};
