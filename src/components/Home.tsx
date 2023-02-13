import { Header } from './Header';
import { Box, Button, Paper, Typography } from '@mui/material';
import { TokensProvider } from '../contexts/tokensContext';
import { sbot_test } from '../lib/switchbot';
import { TestComponent } from './TestComponent';
import { DeviceList } from './DeviceList';

export const Home = () => {
	return (
		<>
			<TokensProvider>
				<Header height="48px" />
				<DeviceList height="592px" />
				{/* <TestComponent /> */}
			</TokensProvider>
		</>
	);
};
