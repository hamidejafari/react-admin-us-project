import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AdminRoutes from "./routes/AdminRoutes";
import LoginForm from "./pages/login/LoginForm";

import "./App.scss";

const theme = createTheme({
  palette: {
    type: "light",
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;