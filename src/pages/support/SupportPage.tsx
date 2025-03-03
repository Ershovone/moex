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
import {
  Request,
  RequestFilters as RequestFiltersType,
} from "../../types/request";

// Импортируем сервисы для работы с данными
import {
  UserDataService,
  RequestDataService,
  SystemDataService,
  AdminDataService,
} from "../../services";
import useFeedback from "../../hooks/useFeedback";

const SupportPage: FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRequests, setUserRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "closed">(
    "all"
  );
  const [systems, setSystems] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [filters, setFilters] = useState<RequestFiltersType>({
    search: "",
    system: undefined,
    status: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    responsible: undefined,
  });

  const { feedback, showFeedback, closeFeedback } = useFeedback();

  // Проверяем права доступа при монтировании компонента
  useEffect(() => {
    const currentUser = UserDataService.getCurrentUser();

    // Проверяем, является ли текущий пользователь специалистом поддержки
    const isSupportSpecialist = AdminDataService.isSupportSpecialist(
      currentUser.id
    );

    if (!isSupportSpecialist) {
      showFeedback("У вас нет прав для доступа к этой странице", "error");
    }

    // Загружаем системы для фильтрации
    const allSystems = SystemDataService.getAllSystems();
    setSystems(
      allSystems.map((system) => ({ id: system.id, name: system.name }))
    );
  }, [showFeedback]);

  // Загрузка заявок пользователя при его выборе
  useEffect(() => {
    if (selectedUser) {
      const requests = RequestDataService.getUserRequests(selectedUser.id);
      setUserRequests(requests);
      applyFilters(requests);

      showFeedback(
        `Загружены заявки пользователя ${selectedUser.fullName}`,
        "success"
      );
    } else {
      setUserRequests([]);
      setFilteredRequests([]);
    }
  }, [selectedUser, showFeedback]);

  // Применение фильтров к заявкам
  const applyFilters = (requests: Request[]) => {
    let filtered = [...requests];

    // Фильтр по вкладке
    if (activeTab === "active") {
      filtered = filtered.filter((request) =>
        ["new", "in_progress", "on_approval"].includes(request.status)
      );
    } else if (activeTab === "closed") {
      filtered = filtered.filter((request) =>
        ["completed", "closed", "cancelled"].includes(request.status)
      );
    }

    // Применение остальных фильтров
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.number.toLowerCase().includes(searchLower) ||
          request.content.toLowerCase().includes(searchLower) ||
          request.typeName.toLowerCase().includes(searchLower) ||
          request.systemName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.system) {
      filtered = filtered.filter(
        (request) => request.systemId === filters.system
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (request) => request.status === filters.status
      );
    }

    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      filtered = filtered.filter(
        (request) => new Date(request.createdAt) >= dateFrom
      );
    }

    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (request) => new Date(request.createdAt) <= dateTo
      );
    }

    if (filters.responsible) {
      filtered = filtered.filter(
        (request) =>
          request.executorId === filters.responsible ||
          (request.executorName && filters.responsible &&
            request.executorName
              .toLowerCase()
              .includes(filters.responsible.toLowerCase()))
      );
    }

    setFilteredRequests(filtered);
  };

  // Обработчик выбора пользователя
  const handleUserSelect = (user: User | null) => {
    setSelectedUser(user);

    // Сбрасываем фильтры при смене пользователя
    setFilters({
      search: "",
      system: undefined,
      status: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      responsible: undefined,
    });

    setActiveTab("all");
  };

  // Обработчик изменения режима отображения
  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "table" | "cards" | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Обработчик изменения вкладки
  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "all" | "active" | "closed"
  ) => {
    setActiveTab(newValue);
    applyFilters(userRequests);
  };

  // Обработчик выбора заявки
  const handleRequestSelect = (request: Request) => {
    window.open(request.url, "_blank");
    showFeedback(`Открыта заявка №${request.number}`, "info");
  };

  // Обработчик изменения фильтров
  const handleFiltersChange = (newFilters: RequestFiltersType) => {
    setFilters(newFilters);
    applyFilters(userRequests);
  };

  // Эффект для обновления фильтрации при изменении фильтров или вкладки
  useEffect(() => {
    applyFilters(userRequests);
  }, [filters, activeTab]);

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
                systems={systems}
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
        open={feedback.open}
        autoHideDuration={4000}
        onClose={closeFeedback}
      >
        <Alert onClose={closeFeedback} severity={feedback.severity}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupportPage;
