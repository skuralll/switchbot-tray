import { Header } from './Header';
import { Box, Button, Paper, Typography } from '@mui/material';
import { TokensProvider } from '../contexts/tokensContext';
import { sbot_test } from '../lib/switchbot';
import { TestButton } from './TestButton';

export const Home = () => {
	return (
		<>
			<TokensProvider>
				<Header />
				<TestButton />
			</TokensProvider>
		</>
	);
};
