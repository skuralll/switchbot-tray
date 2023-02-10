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
import EditIcon from '@mui/icons-material/Edit';
import { EditTokenDialog } from './EditTokenDialog';

// AppBar
const MainAppBar = styled(AppBar)(({ theme }) => ({
	position: 'fixed',
	variant: `dense`,
}));

// ToolBar
const MainToolbar = styled(Toolbar)(({ theme }) => ({
	minHeight: `36px`,
	backgroundColor: red[600],
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
	// EditTokenDialog
	const [et_open, setETOpen] = React.useState(false);

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
			</Menu>
		</>
	);
};

// ヘッダー
export const Header = () => {
	return (
		<Box sx={{ flexGrow: 1, mb: '48px' }}>
			<MainAppBar>
				<MainToolbar>
					<Box sx={{ m: 0, flexGrow: 1 }} />
					<TitleTypography variant="h6">SwitchBot-Tray</TitleTypography>
					<MainMenu />
				</MainToolbar>
			</MainAppBar>
		</Box>
	);
};
