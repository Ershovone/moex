// src/pages/requests/RequestsPage.tsx

import { FC, useState, useEffect } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tabs,
  Tab,
  Paper,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import {
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import {
  RequestTable,
  RequestCard,
  RequestFilters,
} from "../../components/features/requests";
import {
  Request,
  RequestFilters as RequestFiltersType,
} from "../../types/request";

// Импортируем сервис для работы с заявками и системами
import {
  RequestDataService,
  SystemDataService,
  UserDataService,
} from "../../services";
import useFeedback from "../../hooks/useFeedback";

type ViewMode = "table" | "cards";
type RequestGroup = "my" | "approval" | "all";

const RequestsPage: FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Получаем режим отображения из localStorage (если есть)
    const savedMode = localStorage.getItem("moex_requests_view_mode");
    return (savedMode as ViewMode) || "table";
  });

  const [activeGroup, setActiveGroup] = useState<RequestGroup>("my");
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
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

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // Загружаем системы для фильтрации
    const allSystems = SystemDataService.getAllSystems();
    setSystems(
      allSystems.map((system) => ({ id: system.id, name: system.name }))
    );

    // Загружаем заявки
    loadRequests();
  }, []);

  // Загрузка заявок в зависимости от активной группы
  const loadRequests = () => {
    const currentUser = UserDataService.getCurrentUser();
    let requestsList: Request[] = [];

    if (activeGroup === "my") {
      // Мои заявки
      requestsList = RequestDataService.getUserRequests(currentUser.id);
    } else if (activeGroup === "approval") {
      // Заявки на согласовании
      requestsList = RequestDataService.getUserApprovingRequests(
        currentUser.id
      );
    } else {
      // Все заявки
      requestsList = RequestDataService.getAllRequests();
    }

    setRequests(requestsList);
    applyFilters(requestsList, filters);
  };

  // Применение фильтров к списку заявок
  const applyFilters = (
    requestsList: Request[],
    filterParams: RequestFiltersType
  ) => {
    let filtered = requestsList;

    // Фильтр по поисковому запросу
    if (filterParams.search) {
      const searchLower = filterParams.search.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.number.toLowerCase().includes(searchLower) ||
          request.content.toLowerCase().includes(searchLower) ||
          request.typeName.toLowerCase().includes(searchLower) ||
          request.systemName.toLowerCase().includes(searchLower)
      );
    }

    // Фильтр по системе
    if (filterParams.system) {
      filtered = filtered.filter(
        (request) => request.systemId === filterParams.system
      );
    }

    // Фильтр по статусу
    if (filterParams.status) {
      filtered = filtered.filter(
        (request) => request.status === filterParams.status
      );
    }

    // Фильтр по дате создания (от)
    if (filterParams.dateFrom) {
      const dateFrom = new Date(filterParams.dateFrom);
      filtered = filtered.filter(
        (request) => new Date(request.createdAt) >= dateFrom
      );
    }

    // Фильтр по дате создания (до)
    if (filterParams.dateTo) {
      const dateTo = new Date(filterParams.dateTo);
      dateTo.setHours(23, 59, 59, 999); // Конец дня
      filtered = filtered.filter(
        (request) => new Date(request.createdAt) <= dateTo
      );
    }

    // Фильтр по ответственному
    if (filterParams.responsible) {
      filtered = filtered.filter(
        (request) =>
          request.executorId === filterParams.responsible ||
          (filterParams.responsible &&
            request.executorName
              ?.toLowerCase()
              .includes(filterParams.responsible.toLowerCase()))
      );
    }

    setFilteredRequests(filtered);
  };

  // Обработчик изменения режима отображения
  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
      // Сохраняем режим отображения в localStorage
      localStorage.setItem("moex_requests_view_mode", newMode);
    }
  };

  // Обработчик изменения группы заявок
  const handleGroupChange = (
    _: React.SyntheticEvent,
    newValue: RequestGroup
  ) => {
    setActiveGroup(newValue);
    // Сбрасываем фильтры при смене группы
    setFilters({
      search: "",
      system: undefined,
      status: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      responsible: undefined,
    });
  };

  // Эффект для обновления списка заявок при смене группы
  useEffect(() => {
    loadRequests();
  }, [activeGroup]);

  // Обработчик выбора заявки
  const handleRequestSelect = (request: Request) => {
    // Сохраняем информацию о последнем просмотренном запросе
    localStorage.setItem("moex_last_viewed_request", request.id);

    // Открываем URL заявки в новой вкладке
    window.open(request.url, "_blank");

    showFeedback(`Открыта заявка №${request.number}`, "info");
  };

  // Обработчик изменения фильтров
  const handleFiltersChange = (newFilters: RequestFiltersType) => {
    setFilters(newFilters);
    applyFilters(requests, newFilters);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Заявки
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
        >
          <ToggleButton value="table">
            <ViewListIcon />
          </ToggleButton>
          <ToggleButton value="cards">
            <ViewModuleIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeGroup}
          onChange={handleGroupChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Мои заявки" value="my" />
          <Tab label="На согласовании" value="approval" />
          <Tab label="Все заявки" value="all" />
        </Tabs>
      </Paper>

      <RequestFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        systems={systems}
      />

      {filteredRequests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            {filters.search ||
            filters.system ||
            filters.status ||
            filters.dateFrom ||
            filters.dateTo ||
            filters.responsible
              ? "Заявок, соответствующих выбранным фильтрам, не найдено"
              : activeGroup === "my"
              ? "У вас нет заявок"
              : activeGroup === "approval"
              ? "Нет заявок на согласовании"
              : "Заявки отсутствуют"}
          </Typography>
        </Paper>
      ) : viewMode === "table" ? (
        <RequestTable
          requests={filteredRequests}
          onSelect={handleRequestSelect}
        />
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {filteredRequests.map((request) => (
            <Grid item key={request.id}>
              <RequestCard request={request} onSelect={handleRequestSelect} />
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={closeFeedback}
      >
        <Alert onClose={closeFeedback} severity={feedback.severity}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequestsPage;
