import { Button } from '@mui/material';
import { useTokens } from '../contexts/tokensContext';
import { sbot_test } from '../lib/switchbot';

export const TestButton = () => {
	// アプリケーション全体でのトークン用State
	const { state: tokens, dispatch } = useTokens();

	return (
		<>
			<Button
				variant="contained"
				onClick={async () => {
					console.log(sbot_test(tokens.tokens));
				}}
			>
				Contained
			</Button>
		</>
	);
};
