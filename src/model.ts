// tokens model
export type Tokens = {
	token: string;
	secret: string;
};

// device control command model
export type Command = {
	deviceId: string;
	command: string;
	parameter: string;
};

// settings model
export type Settings = {
	autostart: boolean;
};
