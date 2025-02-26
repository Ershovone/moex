// src/components/features/tasks/TaskFilters.tsx

import { FC, ChangeEvent } from "react";
import { Box, TextField, MenuItem, InputAdornment, Grid } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { TasksFilters, TaskStatus, TaskPriority } from "../../../types/task";

interface TaskFiltersProps {
  filters: TasksFilters;
  onFiltersChange: (filters: TasksFilters) => void;
}

const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
  { value: "active", label: "Активные" },
  { value: "completed", label: "Выполненные" },
  { value: "overdue", label: "Просроченные" },
];

const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
  { value: "urgent", label: "Вне очереди" },
  { value: "high", label: "Высокий" },
  { value: "medium", label: "Средний" },
  { value: "low", label: "Низкий" },
];

const TaskFilters: FC<TaskFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleChange =
    (field: keyof TasksFilters) => (event: ChangeEvent<HTMLInputElement>) => {
      onFiltersChange({
        ...filters,
        [field]: event.target.value,
      });
    };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Поиск задач..."
        value={filters.search}
        onChange={handleChange("search")}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Статус"
            value={filters.status || ""}
            onChange={handleChange("status")}
          >
            <MenuItem value="">Все статусы</MenuItem>
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Приоритет"
            value={filters.priority || ""}
            onChange={handleChange("priority")}
          >
            <MenuItem value="">Все приоритеты</MenuItem>
            {PRIORITY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TaskFilters;
