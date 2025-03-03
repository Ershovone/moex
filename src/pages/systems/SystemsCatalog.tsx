// src/pages/systems/SystemsCatalog.tsx

import { FC, useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { System } from "../../types/system";
import SystemCard from "../../components/features/systems/SystemCard";

// Импортируем сервис для работы с системами
import { SystemDataService } from "../../services";

const SystemsCatalog: FC = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Загружаем системы при монтировании компонента
  useEffect(() => {
    const allSystems = SystemDataService.getAllSystems();
    setSystems(allSystems);
  }, []);

  // Фильтруем системы при изменении поискового запроса
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Если поисковый запрос пустой, загружаем все системы
      const allSystems = SystemDataService.getAllSystems();
      setSystems(allSystems);
    } else {
      // Иначе выполняем поиск
      const filteredSystems = SystemDataService.searchSystems(searchQuery);
      setSystems(filteredSystems);
    }
  }, [searchQuery]);

  return (
    <Box sx={{ mb: 4, width: "100%" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Каталог систем
      </Typography>
      <TextField
        fullWidth
        placeholder="Поиск системы по названию или описанию..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4, width: "100%" }}
      />
      <Grid container spacing={3} sx={{ width: "100%" }}>
        {systems.map((system) => (
          <Grid item xs={12} sm={6} md={4} key={system.id}>
            <SystemCard
              name={system.name}
              description={system.description}
              url={system.url}
            />
          </Grid>
        ))}
        {systems.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              {searchQuery
                ? "Систем, соответствующих критериям поиска, не найдено"
                : "Нет доступных систем"}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SystemsCatalog;
