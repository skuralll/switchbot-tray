import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
	DialogActions,
	Divider,
} from '@mui/material';
import { dialog } from '@tauri-apps/api';
import React, { useEffect, useState, useContext } from 'react';
import { useTokens } from '../contexts/tokensContext';
import { save, setSavedTokens } from '../lib/storage';
import { Tokens } from '../types';

export const EditTokenDialog = (props: {
	open: boolean;
	onClose: () => void;
}) => {
	// アプリケーション全体でのトークン用State
	const { state: tokens, dispatch } = useTokens();
	// このコンポーネント内でのトークン用State
	const [e_tokens, setEditTokens] = useState<Tokens>(tokens);
	// 外部でトークンが変更されたら、このコンポーネント内のトークンも変更する
	useEffect(() => setEditTokens(tokens.tokens), [tokens]);

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
					<TextField
						autoFocus
						margin="none"
						id="name"
						label="Token"
						// type="password"
						fullWidth
						variant="standard"
						size="small"
						value={e_tokens['token']}
						onChange={(event) => {
							const new_tokens: Tokens = {
								token: event.target.value,
								secret: e_tokens['secret'],
							};
							setEditTokens(new_tokens);
						}}
					/>
					<TextField
						autoFocus
						margin="none"
						id="name"
						label="Secret"
						// type="password"
						fullWidth
						variant="standard"
						size="small"
						value={e_tokens['secret']}
						onChange={(event) => {
							let new_tokens: Tokens = {
								token: e_tokens['token'],
								secret: event.target.value,
							};
							setEditTokens(new_tokens);
						}}
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
