import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Home } from './components/Home';
import { theme } from './theme';
import React, { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</Router>
		</ThemeProvider>
	);
}
