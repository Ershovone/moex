// src/pages/requests/RequestsPage.tsx

import { FC, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tabs,
  Tab,
  Paper,
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

// Моковые данные для примера
const MOCK_SYSTEMS = [
  { id: "itsm", name: "ITSM" },
  { id: "mpg", name: "MPG" },
  { id: "hrsm", name: "HRSM" },
];

const MOCK_REQUESTS: Request[] = [
  {
    id: "1",
    systemId: "itsm",
    systemName: "ITSM",
    authorId: "user1",
    authorName: "Иванов И.И.",
    typeId: "access",
    typeName: "Заявка на доступ",
    number: "REQ-2024-001",
    content: "Предоставить доступ к системе документооборота",
    status: "new",
    createdAt: "2024-02-24T10:00:00",
    url: "#",
  },
  {
    id: "2",
    systemId: "hrsm",
    systemName: "HRSM",
    authorId: "user2",
    authorName: "Петров П.П.",
    executorId: "user3",
    executorName: "Сидоров С.С.",
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

type ViewMode = "table" | "cards";
type RequestGroup = "my" | "approval" | "all";

const RequestsPage: FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [activeGroup, setActiveGroup] = useState<RequestGroup>("my");
  const [requests] = useState<Request[]>(MOCK_REQUESTS);
  const [filters, setFilters] = useState<RequestFiltersType>({
    search: "",
    system: undefined,
    status: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    responsible: undefined,
  });

  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleGroupChange = (
    _: React.SyntheticEvent,
    newValue: RequestGroup
  ) => {
    setActiveGroup(newValue);
  };

  const handleRequestSelect = (request: Request) => {
    window.open(request.url, "_blank");
  };

  const handleFiltersChange = (newFilters: RequestFiltersType) => {
    setFilters(newFilters);
    // Здесь будет логика фильтрации заявок
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
        systems={MOCK_SYSTEMS}
      />

      {viewMode === "table" ? (
        <RequestTable requests={requests} onSelect={handleRequestSelect} />
      ) : (
        <Box
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
          {requests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onSelect={handleRequestSelect}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RequestsPage;
