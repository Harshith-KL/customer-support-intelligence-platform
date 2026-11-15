
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563EB",
      light: "#60A5FA",
      dark: "#1D4ED8",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#0D9488",
    },

    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },

    success: { main: "#16A34A" },
    warning: { main: "#D97706" },
    error: { main: "#DC2626" },
    info: { main: "#0284C7" },

    divider: "#E2E8F0",
  },

  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",

    h1: { fontSize: "2rem", fontWeight: 700 },
    h2: { fontSize: "1.75rem", fontWeight: 700 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    h5: { fontSize: "1.125rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },

    body1: { fontSize: "0.95rem" },
    body2: { fontSize: "0.875rem" },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 18px",
          boxShadow: "none",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #E2E8F0",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
