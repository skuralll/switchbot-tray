// tokens model
export type Tokens = {
	token: string;
	secret: string;
};

// base device model
export type TDevice = {
	deviceId: string | null;
	deviceName: string | null;
	deviceType: string | null;
	enableCloudService: boolean | null;
	hubDeviceId: string | null;
	remoteType: string | null;
};

// device control command model
export type Command = {
	deviceId: string;
	command: string;
	parameter: string;
};
