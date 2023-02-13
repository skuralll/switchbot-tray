import { TDevice } from '../model';

// 各Aアクション
export type DevicesAction = { type: 'SET_DEVICES'; devices: TDevice[] };

// デバイスリストの状態
export type DevicesState = {
	devices: TDevice[];
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
