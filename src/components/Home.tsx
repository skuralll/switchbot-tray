import { Header } from './Header';
import { Box, Button, Paper, Typography } from '@mui/material';
import { TokensProvider } from '../contexts/tokensContext';
import { TestComponent } from './TestComponent';
import { DeviceList } from './DeviceList';
import { DevicesProvider } from '../contexts/devicesContext';
import { SnackbarContextProvider } from '../libs/snackbar/Snackbar';
import { SettingsProvider } from '../contexts/settingsContext';

export const Home = () => {
	return (
		<>
			<SnackbarContextProvider>
				<DevicesProvider>
					<Header height="36px" />
					<DeviceList height="604px" />
				</DevicesProvider>
			</SnackbarContextProvider>
		</>
	);
};
