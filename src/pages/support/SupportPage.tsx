// src/pages/support/SupportPage.tsx

import { FC, useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
  Tab,
  Tabs,
} from "@mui/material";
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import UserSearch from "../../components/features/support/UserSearch";
import UserInfo from "../../components/features/support/UserInfo";
import { RequestTable } from "../../components/features/requests";
import { RequestFilters } from "../../components/features/requests";
import { User } from "../../types/support";
import { Request } from "../../types/request";

// Моковые данные для заявок пользователя
const mockUserRequests = (userId: string): Request[] => [
  {
    id: `${userId}-req-1`,
    systemId: "itsm",
    systemName: "ITSM",
    authorId: userId,
    authorName: "Иванов И.И.",
    executorId: "user3",
    executorName: "Сидоров С.С.",
    typeId: "access",
    typeName: "Заявка на доступ",
    number: "REQ-2024-001",
    content: "Предоставить доступ к системе документооборота",
    status: "new",
    createdAt: "2024-02-24T10:00:00",
    url: "#",
  },
  {
    id: `${userId}-req-2`,
    systemId: "hrsm",
    systemName: "HRSM",
    authorId: userId,
    authorName: "Иванов И.И.",
    typeId: "vacation",
    typeName: "Заявление на отпуск",
    number: "REQ-2024-002",
    content: "Плановый отпуск с 01.03.2024 по 14.03.2024",
    status: "on_approval",
    createdAt: "2024-02-23T15:30:00",
    plannedDate: "2024-03-01T00:00:00",
    url: "#",
  },
];

const SupportPage: FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRequests, setUserRequests] = useState<Request[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "closed">(
    "all"
  );
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info" as "info" | "success" | "warning" | "error",
  });

  const [filters, setFilters] = useState({
    search: "",
    system: undefined,
    status: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    responsible: undefined,
  });

  useEffect(() => {
    if (selectedUser) {
      // В реальном приложении здесь будет запрос к API
      const requests = mockUserRequests(selectedUser.id);
      setUserRequests(requests);
    } else {
      setUserRequests([]);
    }
  }, [selectedUser]);

  const handleUserSelect = (user: User | null) => {
    setSelectedUser(user);
    if (user) {
      setNotification({
        open: true,
        message: `Загружены заявки пользователя ${user.fullName}`,
        severity: "success",
      });
    }
  };

  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "table" | "cards" | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "all" | "active" | "closed"
  ) => {
    setActiveTab(newValue);
  };

  const handleRequestSelect = (request: Request) => {
    window.open(request.url, "_blank");
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Фильтрация заявок по активной вкладке
  const filteredRequests = userRequests.filter((request) => {
    if (activeTab === "active") {
      return ["new", "in_progress", "on_approval"].includes(request.status);
    } else if (activeTab === "closed") {
      return ["completed", "closed", "cancelled"].includes(request.status);
    }
    return true;
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Рабочее место специалиста технической поддержки
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Поиск сотрудника
          </Typography>
          <UserSearch onUserSelect={handleUserSelect} />
        </Paper>

        {selectedUser && (
          <>
            <UserInfo user={selectedUser} />

            <Paper sx={{ mb: 3 }}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2,
                }}
              >
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Все заявки" value="all" />
                  <Tab label="Активные" value="active" />
                  <Tab label="Завершенные" value="closed" />
                </Tabs>

                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  size="small"
                  sx={{ m: 1 }}
                >
                  <ToggleButton value="table">
                    <ViewListIcon />
                  </ToggleButton>
                  <ToggleButton value="cards">
                    <ViewModuleIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <RequestFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                systems={[
                  { id: "itsm", name: "ITSM" },
                  { id: "hrsm", name: "HRSM" },
                  { id: "mpg", name: "MPG" },
                ]}
              />
            </Paper>

            {filteredRequests.length > 0 ? (
              <Paper>
                <RequestTable
                  requests={filteredRequests}
                  onSelect={handleRequestSelect}
                />
              </Paper>
            ) : (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  {selectedUser
                    ? "Заявки не найдены"
                    : "Выберите сотрудника для просмотра заявок"}
                </Typography>
              </Paper>
            )}
          </>
        )}
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupportPage;
