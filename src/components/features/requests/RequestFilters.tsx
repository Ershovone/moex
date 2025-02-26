// src/components/features/requests/RequestFilters.tsx

import { FC, ChangeEvent } from "react";
import {
  Box,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Grid,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { RequestFilters, RequestStatus } from "../../../types/request";

interface RequestFiltersProps {
  filters: RequestFilters;
  onFiltersChange: (filters: RequestFilters) => void;
  systems: Array<{ id: string; name: string }>;
}

const STATUS_OPTIONS: Array<{ value: RequestStatus; label: string }> = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "on_approval", label: "На согласовании" },
  { value: "completed", label: "Выполнена" },
  { value: "closed", label: "Закрыта" },
  { value: "cancelled", label: "Отменена" },
];

const RequestFiltersComponent: FC<RequestFiltersProps> = ({
  filters,
  onFiltersChange,
  systems,
}) => {
  const handleChange =
    (field: keyof RequestFilters) => (event: ChangeEvent<HTMLInputElement>) => {
      onFiltersChange({
        ...filters,
        [field]: event.target.value,
      });
    };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      system: undefined,
      status: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      responsible: undefined,
    });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Поиск по заявкам..."
        value={filters.search}
        onChange={handleChange("search")}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: filters.search && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => onFiltersChange({ ...filters, search: "" })}
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            label="Система"
            value={filters.system || ""}
            onChange={handleChange("system")}
          >
            <MenuItem value="">Все системы</MenuItem>
            {systems.map((system) => (
              <MenuItem key={system.id} value={system.id}>
                {system.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            label="Статус"
            value={filters.status || ""}
            onChange={handleChange("status")}
          >
            <MenuItem value="">Все статусы</MenuItem>
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            fullWidth
            label="Дата с"
            value={filters.dateFrom || ""}
            onChange={handleChange("dateFrom")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            fullWidth
            label="Дата по"
            value={filters.dateTo || ""}
            onChange={handleChange("dateTo")}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => {
            /* Дополнительные фильтры */
          }}
        >
          Дополнительные фильтры
        </Button>
        <Button variant="text" onClick={clearFilters}>
          Сбросить фильтры
        </Button>
      </Box>
    </Box>
  );
};

export default RequestFiltersComponent;
