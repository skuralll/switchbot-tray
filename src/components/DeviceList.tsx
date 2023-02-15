import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	css,
	Grid,
	Paper,
	Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useDevices } from '../contexts/devicesContext';
import { useTokens } from '../contexts/tokensContext';
import { getDevices } from '../lib/switchbot';
import { TDevice } from '../model';

export const DeviceList = ({ height }: { height: string }) => {
	const { state: tokens, dispatch: dispatch_tokens } = useTokens();
	const { state: devices, dispatch: dispatch_devices } = useDevices();

	// トークンが変更された場合デバイスリストを更新する
	useEffect(() => {
		(async () => {
			let devices: TDevice[] = [];
			try {
				devices = await getDevices(tokens.tokens);
				console.log(devices.length);
			} catch (err) {
				//取得エラー時
			} finally {
				dispatch_devices({
					type: 'SET_DEVICES',
					devices: devices,
				});
			}
		})();
	}, [tokens]);

	return (
		<>
			<Box
				component="div"
				height={height}
				sx={{ overflow: 'auto', bgcolor: '#f7f8f8', pt: 1.5, px: 1 }}
			>
				<Grid container spacing={2}>
					{devices.devices.map((device) => (
						<Device key={device.deviceId} device={device} />
					))}
				</Grid>
			</Box>
		</>
	);
};

export const Device = ({ device }: { device: TDevice }) => {
	return (
		<Grid item xs={6}>
			<Card>
				<CardContent sx={{ justifyContent: 'center' }}>
					<Typography
						sx={{ fontSize: '14px' }}
						color="text.secondary"
						gutterBottom
					>
						{device.deviceType ?? device.remoteType ?? 'unknown'}
					</Typography>
					<Typography variant="h5" component="div">
						{device.deviceName}
					</Typography>
					{/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
						{device.deviceId}
					</Typography> */}
				</CardContent>
				<CardActions sx={{ justifyContent: 'center' }}>
					<Button
						size="small"
						variant="outlined"
						color="error"
						onClick={() => {}}
					>
						ON
					</Button>
					<Button
						size="small"
						variant="outlined"
						color="primary"
						onClick={() => {}}
					>
						OFF
					</Button>
				</CardActions>
			</Card>
		</Grid>
	);
};
