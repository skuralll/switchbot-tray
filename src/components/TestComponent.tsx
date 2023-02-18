import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useTokens } from '../contexts/tokensContext';
import { Command } from '../model';
import {
	getDevices,
	getStatus,
	sendCommand,
} from '../libs/switchbot/switchbot';
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
						const res = await getStatus(tokens.tokens, 'D9636F139806');
						setText(JSON.stringify(res));
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
