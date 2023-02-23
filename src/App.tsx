import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Home } from './components/Home';
import { theme } from './theme';
import React, { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';
import './App.css';
import { SettingsProvider } from './contexts/settingsContext';
import { TokensProvider } from './contexts/tokensContext';
import { DevicesProvider } from './contexts/devicesContext';

export default function App() {
	return (
		<div className="container">
			<SettingsProvider>
				<TokensProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<Router>
							<Routes>
								<Route path="/" element={<Home />} />
							</Routes>
						</Router>
					</ThemeProvider>
				</TokensProvider>
			</SettingsProvider>
		</div>
	);
}
