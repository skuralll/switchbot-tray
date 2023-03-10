import * as React from 'react';
import {
	AppBar,
	Box,
	Button,
	IconButton,
	Toolbar,
	Typography,
	Menu,
	MenuItem,
	ListItemIcon,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { styled } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import { EditTokenDialog } from './EditTokenDialog';
import { SettingDialog } from './SettingDialog';

// AppBar
const MainAppBar = styled(AppBar)(({ theme }) => ({
	position: 'fixed',
	variant: `dense`,
}));

// ToolBar
const MainToolbar = styled(Toolbar)(({ theme }) => ({
	minHeight: `36px`,
	backgroundColor: 'primary',
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
	flexGrow: 1,
	component: 'div',
}));

const MenuIconButton = styled(IconButton)(({ theme }) => ({
	size: 'small',
	edge: 'end',
	color: 'inherit',
}));

const RefreshButton = styled(IconButton)(({ theme }) => ({
	size: 'small',
	edge: 'end',
	'&.Mui-disabled': {
		background: 'transparent',
		color: 'transparent',
	},
}));

// メニューボタン＆メインメニュー
const MainMenu = () => {
	/*メニュー表示用 */
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const menu_open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	/*各アイテム用 */
	// トークン編集用ダイアログ
	const [et_open, setETOpen] = React.useState(false);
	// 設定用ダイアログ
	const [st_open, setSTOpen] = React.useState(false);

	return (
		<>
			<MenuIconButton sx={{ m: 0 }} onClick={handleClick}>
				<MenuIcon />
			</MenuIconButton>
			<EditTokenDialog
				open={et_open}
				onClose={() => {
					setETOpen(false);
				}}
			/>
			<SettingDialog open={st_open} setDialogOpen={setSTOpen} />
			<Menu
				id="main-menu"
				anchorEl={anchorEl}
				open={menu_open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				<MenuItem
					onClick={() => {
						handleClose();
						setETOpen(true);
					}}
				>
					<ListItemIcon>
						<EditIcon fontSize="small" />
					</ListItemIcon>
					Edit Token
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClose();
						setSTOpen(true);
					}}
				>
					<ListItemIcon>
						<SettingsIcon fontSize="small" />
					</ListItemIcon>
					Settings
				</MenuItem>
			</Menu>
		</>
	);
};

const Title = () => {
	return (
		<TitleTypography variant="h6" textAlign="center">
			SwitchBot-Tray
		</TitleTypography>
	);
};

const DeviceRefreshButton = () => {
	return (
		<RefreshButton
			disabled
			onClick={() => {
				// todo
			}}
		>
			<RefreshIcon />
		</RefreshButton>
	);
};

// ヘッダー
export const Header = ({ height }: { height: string }) => {
	return (
		<Box sx={{ mb: { height } }}>
			<MainAppBar>
				<MainToolbar>
					<DeviceRefreshButton />
					<Title />
					<MainMenu />
				</MainToolbar>
			</MainAppBar>
		</Box>
	);
};
