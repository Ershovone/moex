// src/components/features/support/UserSearch.tsx

import { FC, useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import { User } from "../../../types/support";
import { UserDataService } from "../../../services";

interface UserSearchProps {
  onUserSelect: (user: User | null) => void;
}

const UserSearch: FC<UserSearchProps> = ({ onUserSelect }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Поиск пользователей при вводе поискового запроса
  useEffect(() => {
    if (searchValue.length > 2) {
      setIsLoading(true);
      
      // Имитация небольшой задержки для реалистичности
      const timer = setTimeout(() => {
        const users = UserDataService.searchUsers(searchValue);
        setFilteredUsers(users);
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setFilteredUsers([]);
    }
  }, [searchValue]);

  // Обработчик выбора пользователя
  const handleUserSelect = (value: User | null) => {
    setSelectedUser(value);
    onUserSelect(value);
  };

  // Получение метки для отображения варианта поиска
  const getOptionLabel = (option: User) => option.fullName;

  return (
    <Autocomplete
      options={filteredUsers}
      getOptionLabel={getOptionLabel}
      value={selectedUser}
      onChange={(_, newValue) => handleUserSelect(newValue)}
      onInputChange={(_, newValue) => setSearchValue(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Поиск сотрудника по ФИО, почте или должности"
          placeholder="Начните вводить минимум 3 символа..."
          fullWidth
        />
      )}
      renderOption={(props, option) => (
        <Paper component="li" {...props} elevation={0}>
          <Box display="flex" alignItems="center" p={1}>
            <Avatar sx={{ mr: 2 }}>{option.fullName.charAt(0)}</Avatar>
            <Box>
              <Typography variant="subtitle1">{option.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {option.position}, {option.department}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {option.email}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
      noOptionsText={
        searchValue.length > 2
          ? "Пользователь не найден"
          : "Введите минимум 3 символа для поиска"
      }
      loading={isLoading}
      loadingText="Поиск..."
      fullWidth
    />
  );
};

export default UserSearch;