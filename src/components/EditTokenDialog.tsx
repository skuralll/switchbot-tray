import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
	DialogActions,
	Divider,
	InputAdornment,
	IconButton,
} from '@mui/material';
import { dialog } from '@tauri-apps/api';
import React, { useEffect, useState, useContext } from 'react';
import { useTokens } from '../contexts/tokensContext';
import { save, setSavedTokens } from '../libs/storage';
import { Tokens } from '../model';

export const EditTokenDialog = (props: {
	open: boolean;
	onClose: () => void;
}) => {
	// アプリケーション全体でのトークン用State
	const { state: tokens, dispatch: dispatch } = useTokens();
	// このコンポーネント内でのトークン用State
	const [e_tokens, setEditTokens] = useState<Tokens>(tokens.tokens);
	// 外部でトークンが変更されたら、このコンポーネント内のトークンも変更する
	useEffect(() => setEditTokens(tokens.tokens), [tokens]);

	//パスワードを表示するかどうかを管理するState
	const [showPassword, setShowPassword] = React.useState(false);

	// 開閉用State
	const [dialogOpen, setDialogOpen] = useState(false);
	// ダイアログを閉じる
	const handleClose = () => {
		setEditTokens(tokens.tokens);
		setDialogOpen(false);
		props.onClose();
	};

	useEffect(() => setDialogOpen(props.open), [props.open]); // 外部のopenが変更されたら、dialogOpenを変更する

	// Registerを押すと、トークンを保存する
	const handleRegister = () => {
		dispatch({ type: 'SET_TOKENS', tokens: e_tokens });
	};

	return (
		<div>
			<Dialog open={dialogOpen} onClose={handleClose}>
				<DialogTitle>Edit Token</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please enter your SwitchBot token and secret here.
					</DialogContentText>
					<TokenField
						label="Token"
						tokenKey="token"
						showPassword={showPassword}
						setShowPassword={setShowPassword}
						editTokens={e_tokens}
						setEditTokens={setEditTokens}
					/>
					<TokenField
						label="Secret"
						tokenKey="secret"
						showPassword={showPassword}
						setShowPassword={setShowPassword}
						editTokens={e_tokens}
						setEditTokens={setEditTokens}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={() => {
							handleRegister();
							handleClose();
						}}
					>
						Register
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

// トークン、シークレット用入力フィールド
export const TokenField = ({
	label,
	tokenKey,
	showPassword,
	setShowPassword,
	editTokens,
	setEditTokens,
}: {
	label: string;

	tokenKey: keyof Tokens;
	showPassword: boolean;
	setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
	editTokens: Tokens;
	setEditTokens: React.Dispatch<React.SetStateAction<Tokens>>;
}) => {
	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<TextField
			autoFocus
			margin="none"
			id="name"
			label={label}
			type={showPassword ? 'text' : 'password'}
			fullWidth
			variant="standard"
			size="small"
			value={editTokens[tokenKey]}
			onChange={(event) => {
				const new_tokens: Tokens = JSON.parse(JSON.stringify(editTokens)); // deep copy;
				new_tokens[tokenKey] = event.target.value;
				setEditTokens(new_tokens);
			}}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={toggleShowPassword}
							onMouseDown={toggleShowPassword}
						>
							{showPassword ? <Visibility /> : <VisibilityOff />}
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	);
};
