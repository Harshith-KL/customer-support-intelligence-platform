
import { ThemeProvider, CssBaseline } from "@mui/material";

import theme from "./theme/theme";
import QueryProvider from "./providers/QueryProvider";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
0