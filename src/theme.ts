import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    // Глобальное переопределение стилей фокуса
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.Mui-focusVisible": {
            outline: "2px solid rgba(25, 118, 210, 0.2)",
            outlineOffset: 2,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(25, 118, 210, 0.5)",
            borderWidth: "1px",
          },
          "&.Mui-focused:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(25, 118, 210, 0.7)",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.Mui-focusVisible": {
            outline: "2px solid rgba(25, 118, 210, 0.2)",
            outlineOffset: 2,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "&.Mui-focusVisible .MuiSwitch-thumb": {
            outline: "2px solid rgba(25, 118, 210, 0.2)",
            outlineOffset: 2,
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-focusVisible": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
            outline: "none",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "rgba(25, 118, 210, 0.5)",
              borderWidth: "1px",
            },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-focusVisible": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
            outline: "none",
          },
        },
      },
    },
  },
});

export default theme;
