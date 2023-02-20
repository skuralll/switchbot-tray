import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	css,
	Fab,
	Grid,
	Paper,
	Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useEffect, useState } from 'react';
import { useDevices } from '../contexts/devicesContext';
import { useTokens } from '../contexts/tokensContext';
import { useSnackbar } from '../libs/snackbar/Snackbar';
import {
	getDevices,
	getStatus,
	sendCommand,
} from '../libs/switchbot/switchbot';
import { Command } from '../model';
import { SwitchBotDevice } from '../libs/switchbot/devices';

// デバイスリスト
export const DeviceList = ({ height }: { height: string }) => {
	const { state: tokens, dispatch: dispatch_tokens } = useTokens();
	const { state: devices, dispatch: dispatch_devices } = useDevices();

	// デバイスリストを更新する
	const updateDeviceList = async () => {
		dispatch_devices({
			type: 'SET_DEVICES',
			devices: [],
		});
		let devices: SwitchBotDevice[] = [];
		try {
			devices = await getDevices(tokens.tokens);
		} catch (err) {
			//取得エラー時
		} finally {
			dispatch_devices({
				type: 'SET_DEVICES',
				devices: devices,
			});
		}
	};

	// トークンが変更された場合デバイスリストを更新する
	useEffect(() => {
		updateDeviceList();
	}, [tokens]);

	return (
		<>
			<Fab
				color="primary"
				sx={{ position: 'fixed', bottom: '20px', right: '20px' }}
				onClick={updateDeviceList}
			>
				<RefreshIcon />
			</Fab>
			<Box
				component="div"
				height={height}
				sx={{ overflow: 'auto', bgcolor: '#f7f8f8', pt: 1.5, px: 1 }}
			>
				<Grid container spacing={2}>
					{devices.devices.map((device) => (
						<Device key={device.deviceId} device_raw={device} />
					))}
				</Grid>
			</Box>
		</>
	);
};

// デバイス
export const Device = ({ device_raw }: { device_raw: SwitchBotDevice }) => {
	const { showSnackbar } = useSnackbar();
	const { state: tokens, dispatch: dispatch_tokens } = useTokens();
	// デバイス管理用State
	const [device, setDevice] = useState(device_raw);
	useEffect(() => {
		(async () => {
			// デバイスの詳細情報を取得する
			try {
				const res = await getStatus(tokens.tokens, device.deviceId);
				let new_device = JSON.parse(JSON.stringify(device)); // deep copy
				new_device.detail = res;
				setDevice(new_device);
			} catch (err) {
				//取得エラー時
				// todo
			}
		})();
	}, []);

	return (
		<Grid item xs={6}>
			<Card>
				<CardContent sx={{ justifyContent: 'center', pb: 0 }}>
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
					<DeviceInfo device={device} />
				</CardContent>
				<CardActions sx={{ justifyContent: 'center' }}>
					<DeviceControl device={device} />
				</CardActions>
			</Card>
		</Grid>
	);
};

// デバイス詳細情報
const DeviceInfo = ({ device }: { device: SwitchBotDevice }) => {
	//todo
	let info = '---';
	if (device.detail != null) {
		// 各Botごとに詳細情報を作成する
		switch (device.deviceType) {
			case 'Bot':
				info = `${device.detail.power}`.toUpperCase();
				break;
			case 'Plug Mini (US)':
			case 'Plug Mini (JP)':
				info = `${device.detail.voltage}V | ${device.detail.weight}W/d`;
				break;
			case 'Plug':
				info = `${device.detail.power}`.toUpperCase();
				break;
			case 'Meter':
				info = `${device.detail.temperature}℃ | ${device.detail.humidity}%`;
				break;
		}
	}

	return (
		<>
			<Typography sx={{ m: 0, fontSize: '14px' }} color="text.secondary">
				{info}
			</Typography>
		</>
	);
};

// デバイス詳細情報
const DeviceControl = ({ device }: { device: SwitchBotDevice }) => {
	const { showSnackbar } = useSnackbar();
	const { state: tokens, dispatch: dispatch_tokens } = useTokens();

	// 操作コマンドを送信し、結果をSnackBarに表示する
	const controlDevice = async (command: Command) => {
		try {
			const res = await sendCommand(tokens.tokens, command);
			showSnackbar(`${res}`, 'success');
		} catch (err) {
			showSnackbar(`${err}`, 'error');
		}
	};

	const dummy = (
		<Button size="small" disabled>
			---
		</Button>
	);

	if (device.detail == null) {
		return dummy;
	}

	const d_type = device.deviceType ?? device.remoteType ?? 'unknown';
	switch (d_type) {
		case 'Plug Mini (US)':
		case 'Plug Mini (JP)':
		case 'Plug':
		case 'Bot':
			return (
				<>
					<Button
						size="small"
						variant="outlined"
						color="error"
						onClick={async () => {
							controlDevice({
								deviceId: device.deviceId,
								command: 'turnOn',
								parameter: 'default',
							});
						}}
					>
						ON
					</Button>
					<Button
						size="small"
						variant="outlined"
						color="primary"
						onClick={async () => {
							controlDevice({
								deviceId: device.deviceId,
								command: 'turnOff',
								parameter: 'default',
							});
						}}
					>
						OFF
					</Button>
				</>
			);

		default:
			return dummy;
	}
};
