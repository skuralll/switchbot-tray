import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Grid,
	Typography,
} from '@mui/material';

export const DeviceList = ({ height }: { height: string }) => {
	return (
		<>
			<Box component="div" height={height} sx={{ overflow: 'auto' }}>
				<Grid container spacing={2}>
					<Device />
					<Device />
					<Device />
					<Device />
					<Device />
					<Device />
					<Device />
					<Device />
					<Device />
					<Device />
					<Device />
				</Grid>
			</Box>
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
