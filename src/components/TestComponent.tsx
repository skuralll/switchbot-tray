import { Button, Typography } from '@mui/material';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useTokens } from '../contexts/tokensContext';
import { TDevice } from '../model';
import { getDevices } from '../lib/switchbot';

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
						const res = await getDevices(tokens.tokens);
						setText('result: ' + JSON.stringify(res));
					} catch (e) {
						setText(`${e}`);
					}
				}}
			>
				Contained
			</Button>
		</>
	);
};
