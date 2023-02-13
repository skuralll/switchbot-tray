import {
	Button,
	Card,
	CardActions,
	CardContent,
	Grid,
	Typography,
} from '@mui/material';

export const DeviceList = () => {
	return (
		<>
			<Grid container spacing={2}>
				<Device />
				<Device />
				<Device />
				<Device />
			</Grid>
		</>
	);
};

export const Device = () => {
	return (
		<Grid item xs={6}>
			<Card>
				<CardContent>
					<Typography
						sx={{ fontSize: '14px' }}
						color="text.secondary"
						gutterBottom
					>
						Type
					</Typography>
					<Typography variant="h5" component="div">
						Name
					</Typography>
					<Typography sx={{ mb: 1.5 }} color="text.secondary">
						Info
					</Typography>
				</CardContent>
				<CardActions>
					<Button size="small">Action</Button>
				</CardActions>
			</Card>
		</Grid>
	);
};
