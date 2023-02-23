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
import { useSettings } from '../contexts/settingsContext';
import { Settings } from '../model';

export const SettingDialog = ({
	open,
	setDialogOpen,
}: {
	open: boolean;
	setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	// 設定管理用Context
	const { state: settings, dispatch: dispatch } = useSettings();
	// このコンポーネント内でのローカル設定用State
	const [local_settings, setLocalSettings] = useState(settings.settings);

	useEffect(() => setLocalSettings(settings.settings), [settings]); // 外部でSettingsが更新されたら、このコンポーネント内のローカル設定も更新する(非同期処理用)

	// ダイアログを閉じる
	const handleClose = () => {
		setLocalSettings(settings.settings);
		setDialogOpen(false);
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Settings</DialogTitle>
				<DialogContent>
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									onChange={() => {
										// ローカルな設定を更新する
										let new_local_settings = JSON.parse(
											JSON.stringify(local_settings)
										);
										new_local_settings.autostart =
											!new_local_settings.autostart;
										setLocalSettings(new_local_settings);
									}}
									checked={local_settings.autostart}
								/>
							}
							label="Launch on startup "
						/>
					</FormGroup>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={() => {
							// グローバルな設定を更新する
							dispatch({ type: 'SET_SETTINGS', settings: local_settings });
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
