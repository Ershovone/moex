import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "./components/layout/Layout";
import theme from "./theme";

import { Routes, Route } from "react-router-dom";
import setupFocusManagement from "./utils/focusManagement";
import { useEffect } from "react";
import { NotificationProvider } from "./contexts/NotificationContext";
import SystemsCatalog from "./pages/systems/SystemsCatalog";
import ServicesCatalog from "./pages/services/ServicesCatalog";
import RequestsPage from "./pages/requests/RequestsPage";
import TasksPage from "./pages/tasks/TasksPage";
import AdminPage from "./pages/admin/AdminPage";
import SupportPage from "./pages/support/SupportPage";

function App() {
  useEffect(() => {
    // Настройка управления фокусом при запуске приложения
    setupFocusManagement();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/systems" element={<SystemsCatalog />} />
              <Route path="/services" element={<ServicesCatalog />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/" element={<ServicesCatalog />} />
            </Routes>
          </Layout>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
