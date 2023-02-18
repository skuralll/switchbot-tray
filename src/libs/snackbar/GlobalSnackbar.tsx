import * as React from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

/** スナックバーの表示をカスタマイズ */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/** GlobalSnackbar コンポーネントに渡す props の型情報 */
type Props = {
	/** スナックバーを表示するか */
	open: boolean;

	/** スナックバーに表示するメッセージ */
	message: string;

	/** スナックバーの色 (error | warning | info | success) */
	severity?: AlertColor;

	/** スナックバーを閉じるべきタイミングで呼び出されます */
	onClose?: () => void;
};

/** スナックバーを表示するコンポーネント */
export const GlobalSnackbar: React.FC<Props> = ({
	open,
	message,
	severity = 'info',
	onClose,
}) => {
	return (
		<Snackbar
			open={open}
			onClose={onClose}
			autoHideDuration={2000}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
		>
			<Alert severity={severity}>{message}</Alert>
		</Snackbar>
	);
};
