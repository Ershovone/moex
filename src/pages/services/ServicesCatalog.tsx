// src/pages/services/ServicesCatalog.tsx

import { FC, useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { ServiceGroup as ServiceGroupComponent } from "../../components/features/services";
import { Service, ServiceGroup } from "../../types/service";

// Моковые данные на основе ТЗ
const MOCK_SERVICES: ServiceGroup[] = [
  {
    id: "hr",
    name: "Услуги по работе с персоналом (HRSM)",
    services: [
      {
        id: "1",
        name: "Заявка на подбор персонала",
        description: "Создание заявки на подбор нового сотрудника",
        system: "HRSM",
        url: "#",
        instructionUrl: "#",
        feedbackUrl: "#",
      },
      // ... другие услуги HR
    ],
  },
  {
    id: "it",
    name: "Услуги департамента информационных технологий (ITSM)",
    services: [
      {
        id: "2",
        name: "Заявка на доступ к системе",
        description: "Получение доступа к информационным системам",
        system: "ITSM",
        url: "#",
        instructionUrl: "#",
      },
      // ... другие IT услуги
    ],
  },
  // ... другие группы услуг
];

const TABS = ["Все", "Популярные", "Недавние"];

const ServicesCatalog: FC = () => {
  const [serviceGroups, setServiceGroups] =
    useState<ServiceGroup[]>(MOCK_SERVICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const handleServiceSelect = (service: Service) => {
    window.open(service.url, "_blank");
  };

  const filterServices = (query: string) => {
    if (!query) {
      setServiceGroups(MOCK_SERVICES);
      return;
    }

    const filteredGroups = MOCK_SERVICES.map((group) => ({
      ...group,
      services: group.services.filter(
        (service) =>
          service.name.toLowerCase().includes(query.toLowerCase()) ||
          service.description.toLowerCase().includes(query.toLowerCase())
      ),
    })).filter((group) => group.services.length > 0);

    setServiceGroups(filteredGroups);
  };

  useEffect(() => {
    filterServices(searchQuery);
  }, [searchQuery]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Каталог услуг
        </Typography>

        <TextField
          fullWidth
          placeholder="Поиск услуги по названию или описанию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          {TABS.map((tab) => (
            <Tab key={tab} label={tab} />
          ))}
        </Tabs>

        {serviceGroups.map((group) => (
          <ServiceGroupComponent
            key={group.id}
            group={group}
            onSelectService={handleServiceSelect}
          />
        ))}
      </Box>
    </Container>
  );
};

export default ServicesCatalog;
