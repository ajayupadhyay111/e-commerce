// TODO: changes colors as per client requirement

import { createTheme } from "@mui/material";
import { Assistant } from "next/font/google";

const assistantFont = Assistant({
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
});

/* =========================
   🌞 LIGHT THEME (DARK YELLOW)
========================= */
export const lightTheme = createTheme({
  palette: {
    mode: "light",

    common: {
      black: "#030712",
      white: "#ffffff",
    },

    primary: {
      main: "#d97706", // 🔥 dark yellow
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#f59e0b",
      light: "#fde68a",
    },

    background: {
      paper: "#ffffff",
      default: "#ffffff",
    },

    text: {
      primary: "#030712",
      secondary: "#4b5563",
    },

    success: {
      main: "#16a34a",
      contrastText: "#ffffff",
    },

    /* 🚫 no yellow in table rows */
    action: {
      selected: "rgba(0,0,0,0.04)",
      hover: "rgba(0,0,0,0.03)",
      focus: "rgba(0,0,0,0.06)",
      active: "#4b5563",
    },
  },

  typography: {
    fontFamily: assistantFont.style.fontFamily,
  },

  shadows: {
    0: "none",
    1: "0px 2px 4px rgba(0,0,0,0.12)",
    2: "none",
    8: "0 6px 12px rgba(0,0,0,0.15)",
  },

  /* =========================
     📊 DATAGRID FIX
  ========================= */
  components: {
    MuiDataGrid: {
      styleOverrides: {
        row: {
          "&.Mui-selected": {
            backgroundColor: "rgba(0,0,0,0.04)",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "rgba(0,0,0,0.06)",
          },
        },
      },
    },
  },
});

/* =========================
   🌙 DARK THEME (DARK YELLOW)
========================= */
export const darkTheme = createTheme({
  palette: {
    mode: "dark",

    common: {
      black: "#030712",
      white: "#ffffff",
    },

    primary: {
      main: "#f59e0b", // brighter for dark bg
      contrastText: "#030712",
    },

    background: {
      paper: "#0b0a10",
      default: "#0b0a10",
    },

    text: {
      primary: "#e5e7eb",
      secondary: "#9ca3af",
    },

    action: {
      selected: "rgba(255,255,255,0.06)",
      hover: "rgba(255,255,255,0.04)",
      active: "#9ca3af",
    },
  },

  typography: {
    fontFamily: assistantFont.style.fontFamily,
  },

  shadows: {
    0: "none",
    1: "0px 2px 4px rgba(0,0,0,0.3)",
    2: "none",
    8: "0 6px 12px rgba(0,0,0,0.4)",
  },
});
