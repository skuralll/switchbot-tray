import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useTokens } from '../contexts/tokensContext';
import { Command } from '../model';
import { getDevices, sendCommand } from '../libs/switchbot/api';
import { useSnackbar } from '../libs/snackbar/Snackbar';
import { SwitchBotDevice } from '../libs/switchbot/devices';

export const TestComponent = () => {
	// アプリケーション全体でのトークン用State
	const { state: tokens, dispatch: dispatch } = useTokens();
	const [text, setText] = useState('Message');
	const { showSnackbar } = useSnackbar();

	return (
		<>
			<Typography>{text}</Typography>
			<Button
				variant="contained"
				onClick={async () => {
					try {
						const res: object = await invoke('get_status', {
							tokens: tokens.tokens,
							deviceId: 'D9636F139806',
						});
						const temp: number = res['temperature'];
						setText(`${typeof temp} ${Object.prototype.toString.call(temp)}`);
					} catch (e) {
						setText(`Error: ${e}`);
					}
				}}
			>
				Contained
			</Button>
		</>
	);
};
