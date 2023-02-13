import { createContext, Dispatch, useContext, useReducer } from 'react';
import {
	DevicesAction,
	devicesReducer,
	DevicesState,
	initialState,
} from '../reducer/devicesReducer';

type DevicesContextProps = {
	state: DevicesState;
	dispatch: Dispatch<DevicesAction>;
};

const DevicesContext = createContext<DevicesContextProps>({
	state: initialState,
	dispatch: () => initialState,
});

// プロパイダ
export const DevicesProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// ユーザ情報の初期値
	const [state, dispatch] = useReducer(devicesReducer, initialState);
	return (
		<DevicesContext.Provider value={{ state, dispatch }}>
			{children}
		</DevicesContext.Provider>
	);
};

export const useDevices = () => useContext(DevicesContext);
