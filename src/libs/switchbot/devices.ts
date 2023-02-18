// base device model
export type SwitchBotDevice = {
	deviceId: string;
	deviceName: string | null;
	deviceType: string | null;
	enableCloudService: boolean | null;
	hubDeviceId: string | null;
	remoteType: string | null;
};
