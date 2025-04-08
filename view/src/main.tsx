import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { brown, blueGrey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      light: brown[300],
      main: brown[700],
      dark: brown[900],
      contrastText: "#fff",
    },
    secondary: {
      light: blueGrey[300],
      main: blueGrey[500],
      dark: blueGrey[700],
      contrastText: "#fff",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
