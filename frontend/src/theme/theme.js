
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

    h1: { fontSize: "2.25rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.75rem", fontWeight: 650 },
    h4: { fontSize: "1.625rem", fontWeight: 650, lineHeight: 1.25 },
    h5: { fontSize: "1.25rem", fontWeight: 600 },
    h6: { fontSize: "1.0625rem", fontWeight: 600 },

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
          minHeight: 40,
          padding: "8px 16px",
          boxShadow: "none",
        },
        contained: {
          "&:hover": {
            filter: "brightness(0.96)",
          },
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

    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#F8FAFC",
          color: "#475569",
          fontWeight: 600,
          whiteSpace: "nowrap",
        },
        root: {
          borderColor: "#E2E8F0",
          padding: "14px 16px",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "#FFFFFF",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#94A3B8",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export default theme;
