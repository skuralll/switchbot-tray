import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormGroup,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';

export const SettingDialog = ({
	open,
	setDialogOpen,
}: {
	open: boolean;
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	// ダイアログを閉じる
	const handleClose = () => {
		setDialogOpen(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Settings</DialogTitle>
				<DialogContent>
					<FormGroup>
						<FormControlLabel
							control={<Checkbox defaultChecked />}
							label="Launch on startup "
						/>
					</FormGroup>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={() => {
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
