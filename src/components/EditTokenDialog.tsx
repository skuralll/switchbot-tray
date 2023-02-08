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
import React, { useEffect, useState } from 'react';

export const EditTokenDialog = (props: {
	open: boolean;
	onClose: () => void;
}) => {
	// 開閉用State
	const [dialogOpen, setDialogOpen] = useState(false);

	// ダイアログを閉じる
	const handleClose = () => {
		setDialogOpen(false);
		props.onClose();
	};

	useEffect(() => setDialogOpen(props.open), [props.open]); // 外部のopenが変更されたら、dialogOpenを変更する

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
						type="password"
						fullWidth
						variant="standard"
						size="small"
					/>
					<TextField
						autoFocus
						margin="none"
						id="name"
						label="Secret"
						type="password"
						fullWidth
						variant="standard"
						size="small"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleClose}>Register</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
