// base device model
export type SwitchBotDevice = {
	deviceId: string;
	deviceName: string;
	deviceType: string | null;
	enableCloudService: boolean | null;
	hubDeviceId: string;
	remoteType: string | null;
};
