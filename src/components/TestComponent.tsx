import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useTokens } from '../contexts/tokensContext';
import { Command, TDevice } from '../model';
import { getDevices, sendCommand } from '../lib/switchbot';

export const TestComponent = () => {
	// アプリケーション全体でのトークン用State
	const { state: tokens, dispatch: dispatch } = useTokens();
	const [text, setText] = useState('Message');

	return (
		<>
			<Typography>{text}</Typography>
			<Button
				variant="contained"
				onClick={async () => {
					try {
						const command: Command = {
							deviceId: '02-202301072345-96907646',
							command: 'turnOn',
							parameter: 'default',
						};
						const res = await sendCommand(tokens.tokens, command);
						setText('Success: ' + JSON.stringify(res));
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
