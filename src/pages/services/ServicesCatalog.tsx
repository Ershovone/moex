// src/pages/services/ServicesCatalog.tsx

import { FC, useState, useEffect } from "react";
import {
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

// Импортируем сервис для работы с услугами
import { ServiceDataService } from "../../services";

const TABS = ["Все", "Популярные", "Недавние"];

const ServicesCatalog: FC = () => {
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [recentServices, setRecentServices] = useState<Service[]>([]);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    const allServiceGroups = ServiceDataService.getAllServiceGroups();
    setServiceGroups(allServiceGroups);

    // Получаем недавние услуги из localStorage (если они есть)
    const recentServicesJSON = localStorage.getItem("moex_recent_services");
    if (recentServicesJSON) {
      try {
        const parsedServices = JSON.parse(recentServicesJSON) as Service[];
        setRecentServices(parsedServices);
      } catch (e) {
        console.error("Error parsing recent services:", e);
      }
    }
  }, []);

  // Обработчик выбора услуги
  const handleServiceSelect = (service: Service) => {
    // Добавляем услугу в недавние
    const updatedRecentServices = [
      service,
      ...recentServices.filter((s) => s.id !== service.id),
    ].slice(0, 10);
    setRecentServices(updatedRecentServices);

    // Сохраняем недавние услуги в localStorage
    localStorage.setItem(
      "moex_recent_services",
      JSON.stringify(updatedRecentServices)
    );

    // Открываем URL услуги в новой вкладке
    window.open(service.url, "_blank");
  };

  // Обновляем данные при изменении поискового запроса
  useEffect(() => {
    if (activeTab === 0) {
      // Вкладка "Все"
      if (!searchQuery.trim()) {
        const allServiceGroups = ServiceDataService.getAllServiceGroups();
        setServiceGroups(allServiceGroups);
      } else {
        const filteredGroups = ServiceDataService.searchServices(searchQuery);
        setServiceGroups(filteredGroups);
      }
    }
  }, [searchQuery, activeTab]);

  // Обновляем данные при изменении вкладки
  useEffect(() => {
    if (activeTab === 0) {
      // Вкладка "Все"
      if (searchQuery.trim()) {
        const filteredGroups = ServiceDataService.searchServices(searchQuery);
        setServiceGroups(filteredGroups);
      } else {
        const allServiceGroups = ServiceDataService.getAllServiceGroups();
        setServiceGroups(allServiceGroups);
      }
    } else if (activeTab === 1) {
      // Вкладка "Популярные"
      const popularServices = ServiceDataService.getPopularServices();

      // Преобразуем список популярных услуг в группу
      if (popularServices.length > 0) {
        const popularGroup: ServiceGroup = {
          id: "popular",
          name: "Популярные услуги",
          services: popularServices,
        };
        setServiceGroups([popularGroup]);
      } else {
        setServiceGroups([]);
      }
    } else if (activeTab === 2) {
      // Вкладка "Недавние"
      // Преобразуем список недавних услуг в группу
      if (recentServices.length > 0) {
        const recentGroup: ServiceGroup = {
          id: "recent",
          name: "Недавно использованные услуги",
          services: recentServices,
        };
        setServiceGroups([recentGroup]);
      } else {
        setServiceGroups([]);
      }
    }
  }, [activeTab, searchQuery, recentServices]);

  return (
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

      {serviceGroups.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          {activeTab === 0 && searchQuery
            ? "Услуг, соответствующих критериям поиска, не найдено"
            : activeTab === 1
            ? "Нет популярных услуг"
            : "Нет недавно использованных услуг"}
        </Typography>
      ) : (
        serviceGroups.map((group) => (
          <ServiceGroupComponent
            key={group.id}
            group={group}
            onSelectService={handleServiceSelect}
          />
        ))
      )}
    </Box>
  );
};

export default ServicesCatalog;
