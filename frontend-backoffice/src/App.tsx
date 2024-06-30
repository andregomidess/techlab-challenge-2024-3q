import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Router } from './Router.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthenticationProvider } from './contexts/AuthenticationContext.js';
import { AppThemeProvider } from './contexts/ThemeContext.js';
import { CssBaseline } from '@mui/material';


const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <CssBaseline />
        <AuthenticationProvider>
          <Router />
        </AuthenticationProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  )
}
