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

interface UserSearchProps {
  onUserSelect: (user: User | null) => void;
}

// Моковые данные пользователей
const MOCK_USERS: User[] = [
  {
    id: "user1",
    fullName: "Иванов Иван Иванович",
    email: "ivanov@example.com",
    department: "Отдел разработки",
    position: "Старший разработчик",
  },
  {
    id: "user2",
    fullName: "Петров Петр Петрович",
    email: "petrov@example.com",
    department: "Отдел тестирования",
    position: "Тестировщик",
  },
  {
    id: "user3",
    fullName: "Сидорова Анна Владимировна",
    email: "sidorova@example.com",
    department: "Отдел маркетинга",
    position: "Маркетолог",
  },
  {
    id: "user4",
    fullName: "Козлов Дмитрий Сергеевич",
    email: "kozlov@example.com",
    department: "Отдел продаж",
    position: "Менеджер по продажам",
  },
  {
    id: "user5",
    fullName: "Смирнова Елена Александровна",
    email: "smirnova@example.com",
    department: "Бухгалтерия",
    position: "Главный бухгалтер",
  },
];

const UserSearch: FC<UserSearchProps> = ({ onUserSelect }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (searchValue.length > 2) {
      const lowerCaseSearch = searchValue.toLowerCase();
      const filtered = MOCK_USERS.filter(
        (user) =>
          user.fullName.toLowerCase().includes(lowerCaseSearch) ||
          user.email.toLowerCase().includes(lowerCaseSearch) ||
          user.department.toLowerCase().includes(lowerCaseSearch) ||
          user.position.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchValue]);

  const handleUserSelect = (value: User | null) => {
    setSelectedUser(value);
    onUserSelect(value);
  };

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
      noOptionsText="Пользователь не найден"
      loading={searchValue.length > 2 && filteredUsers.length === 0}
      loadingText="Поиск..."
      fullWidth
    />
  );
};

export default UserSearch;
