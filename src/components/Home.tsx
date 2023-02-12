import { Header } from './Header';
import { Box, Button, Paper, Typography } from '@mui/material';
import { TokensProvider } from '../contexts/tokensContext';
import { sbot_test } from '../lib/switchbot';
import { TestComponent } from './TestComponent';

export const Home = () => {
	return (
		<>
			<TokensProvider>
				<Header />
				<TestComponent />
			</TokensProvider>
		</>
	);
};
