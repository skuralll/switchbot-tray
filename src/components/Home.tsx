import { Header } from './Header';
import { Box, Button, Paper, Typography } from '@mui/material';
import { TokensProvider } from '../contexts/tokensContext';

export const Home = () => {
	return (
		<>
			<TokensProvider>
				<Header />
				<Button variant="contained" onClick={async () => {}}>
					Contained
				</Button>
			</TokensProvider>
		</>
	);
};
