import { Header } from './Header';
import { Box, Button, Paper, Typography } from '@mui/material';
import { TokensProvider } from '../contexts/tokensContext';
import { TestComponent } from './TestComponent';
import { DeviceList } from './DeviceList';
import { DevicesProvider } from '../contexts/devicesContext';

export const Home = () => {
	return (
		<>
			<TokensProvider>
				<DevicesProvider>
					<Header height="36px" />
					{/* <TestComponent /> */}
					<DeviceList height="604px" />
				</DevicesProvider>
			</TokensProvider>
		</>
	);
};
