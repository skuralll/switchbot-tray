import {
	alpha,
	Backdrop,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CircularProgress,
	Fab,
	Grid,
	LinearProgress,
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
	// デバイスリストを取得中かどうかを管理するState
	const [loading, setLoading] = useState(false);

	// デバイスリストを更新する
	const updateDeviceList = async () => {
		if (loading) return;

		setLoading(true);
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
		setLoading(false);
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
			<LoadingOverlay isEnable={loading} />
		</>
	);
};

// デバイス
export const Device = ({ device_raw }: { device_raw: SwitchBotDevice }) => {
	const { showSnackbar } = useSnackbar();
	const { state: tokens, dispatch: dispatch_tokens } = useTokens();
	// 何かしらの処理中かどうかを管理するState
	const [processing, setProcessing] = useState(false);

	// デバイス管理用State
	const [device, setDevice] = useState(device_raw);
	useEffect(() => {
		(async () => {
			await updateDeviceInfo();
		})();
	}, []);

	const updateDeviceInfo = async () => {
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
	};

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
					<DeviceControl
						device={device}
						updateDeviceInfo={updateDeviceInfo}
						setProcessing={setProcessing}
					/>
				</CardActions>
				<ProgressBar isEnable={processing} />
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
const DeviceControl = ({
	device,
	updateDeviceInfo,
	setProcessing,
}: {
	device: SwitchBotDevice;
	updateDeviceInfo: () => Promise<void>;
	setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { showSnackbar } = useSnackbar();
	const { state: tokens, dispatch: dispatch_tokens } = useTokens();

	// 操作コマンドを送信し、結果をSnackBarに表示する
	const controlDevice = async (command: Command) => {
		setProcessing(true);
		try {
			const res = await sendCommand(tokens.tokens, command);
			showSnackbar(`${res}`, 'success');
			// デバイス情報を更新する
			await new Promise((s) => setTimeout(s, 3000)); // 反映に時間がかかるため3秒待つ
			await updateDeviceInfo();
		} catch (err) {
			showSnackbar(`${err}`, 'error');
		}
		setProcessing(false);
	};

	const dummy = (
		<Button size="small" disabled>
			---
		</Button>
	);

	// if (device.detail == null) {
	// 	return dummy;
	// }

	const d_type = device.deviceType ?? device.remoteType ?? 'unknown';
	switch (d_type) {
		case 'Hub':
		case 'Hub Plus':
		case 'Hub Mini':
		case 'Meter':
		case 'Meter Plus (JP)':
		case 'Meter Plus (US)':
		case 'Motion Sensor':
		case 'Contact Sensor':
		case 'Keypad':
		case 'Keypad Touch':
			return dummy;

		default:
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
	}
};

// プログレスバー
const ProgressBar = ({ isEnable }: { isEnable: boolean }) => {
	return (
		<>
			{isEnable ? (
				<LinearProgress color="success" sx={{ height: '4px' }} />
			) : (
				<Box sx={{ height: '4px' }} />
			)}
		</>
	);
};

// ロード中に表示するオーバーレイ
const LoadingOverlay = ({ isEnable }: { isEnable: boolean }) => {
	return (
		<Backdrop
			sx={{
				color: '#4caf50',
				bgcolor: alpha('#fff', 0),
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
			open={isEnable}
		>
			<CircularProgress color="inherit" />
		</Backdrop>
	);
};
