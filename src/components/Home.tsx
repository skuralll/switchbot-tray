import { Header } from './Header';
import { Box, Button, Paper, Typography } from '@mui/material';
import { TokensProvider } from '../contexts/tokensContext';
import { TestComponent } from './TestComponent';
import { DeviceList } from './DeviceList';

export const Home = () => {
	return (
		<>
			<TokensProvider>
				<Header height="48px" />
				{/* <TestComponent /> */}
				<DeviceList height="592px" />
			</TokensProvider>
		</>
	);
};
