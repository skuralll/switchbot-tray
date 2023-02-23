import { enable, disable } from 'tauri-plugin-autostart-api';
import React, {
	createContext,
	Dispatch,
	useContext,
	useEffect,
	useReducer,
} from 'react';
import {
	initialState,
	SettingsAction,
	SettingsReducer,
	SettingsState,
} from '../reducer/settingsReducer';
import { Settings } from '../model';

type SettingsContextProps = {
	state: SettingsState;
	dispatch: Dispatch<SettingsAction>;
};

const SettingsContext = createContext<SettingsContextProps>({
	state: initialState,
	dispatch: () => initialState,
});

// プロパイダ
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	// 設定の初期値
	const [state, dispatch] = useReducer(SettingsReducer, initialState);

	return (
		<SettingsContext.Provider value={{ state, dispatch: dispatch }}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => useContext(SettingsContext);
