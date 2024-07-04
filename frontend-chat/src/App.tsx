import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthenticationProvider } from './contexts/AuthenticationProvider.jsx';
import { Chat } from './components/Chat.js';
import { AppThemeProvider } from './contexts/ThemeContext.js';

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <CssBaseline />
        <AuthenticationProvider>
          <Chat />
        </AuthenticationProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  )
}
