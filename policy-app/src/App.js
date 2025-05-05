import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import InsuranceList from './components/insurer_list';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <InsuranceList />
    </ThemeProvider>
  );
}

export default App;
