// src/pages/tasks/TasksPage.tsx

import { FC, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  TaskCard,
  TaskFilters,
  TaskForm,
} from "../../components/features/tasks";
import { Task, TasksFilters } from "../../types/task";

// Импортируем сервис для работы с задачами
import { TaskDataService } from "../../services";

type TaskTab = "all" | "current" | "completed" | "overdue";

const TasksPage: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TaskTab>("current");
  const [filters, setFilters] = useState<TasksFilters>({
    search: "",
    status: undefined,
    priority: undefined,
  });
  const [openForm, setOpenForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // Обновляем daysLeft для всех задач
    TaskDataService.updateDaysLeft();

    // Загружаем все задачи
    const allTasks = TaskDataService.getAllTasks();
    setTasks(allTasks);
  }, []);

  // Обработчик изменения вкладки
  const handleTabChange = (_: React.SyntheticEvent, newValue: TaskTab) => {
    setActiveTab(newValue);
  };

  // Обработчик изменения фильтров
  const handleFiltersChange = (newFilters: TasksFilters) => {
    setFilters(newFilters);
  };

  // Фильтрация задач при изменении вкладки или фильтров
  useEffect(() => {
    let filtered = [...tasks];

    // Фильтр по вкладке
    if (activeTab === "current") {
      filtered = filtered.filter((task) => task.status === "active");
    } else if (activeTab === "completed") {
      filtered = filtered.filter((task) => task.status === "completed");
    } else if (activeTab === "overdue") {
      filtered = filtered.filter((task) => task.status === "overdue");
    }

    // Фильтр по строке поиска
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.number.toLowerCase().includes(searchLower)
      );
    }

    // Фильтр по статусу
    if (filters.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    // Фильтр по приоритету
    if (filters.priority) {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    setFilteredTasks(filtered);
  }, [activeTab, filters, tasks]);

  // Открытие формы создания новой задачи
  const handleOpenForm = () => {
    setEditTask(undefined);
    setOpenForm(true);
  };

  // Открытие формы редактирования задачи
  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditTask(task);
      setOpenForm(true);
    }
  };

  // Сохранение задачи
  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Редактирование существующей задачи
      const updatedTask = TaskDataService.saveTask({
        ...tasks.find((t) => t.id === taskData.id)!,
        ...taskData,
      });

      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );

      setNotification({
        open: true,
        message: "Задача успешно обновлена",
        severity: "success",
      });
    } else {
      // Создание новой задачи
      const assignee = "Иванов И.И."; // В реальном приложении берем из контекста
      const author = "Иванов И.И."; // В реальном приложении берем из контекста

      const newTask = TaskDataService.saveTask({
        title: taskData.title || "Новая задача",
        description: taskData.description || "",
        assignee,
        author,
        priority: taskData.priority || "medium",
        category: "Задача",
        dueDate: taskData.dueDate,
        status: "active",
      } as Task);

      setTasks((prev) => [...prev, newTask]);

      setNotification({
        open: true,
        message: "Задача успешно создана",
        severity: "success",
      });
    }
  };

  // Отметка задачи как выполненной
  const handleCompleteTask = (taskId: string) => {
    TaskDataService.completeTask(taskId);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "completed",
              completedDate: new Date().toISOString(),
            }
          : task
      )
    );

    setNotification({
      open: true,
      message: "Задача помечена как выполненная",
      severity: "success",
    });
  };

  // Копирование задачи
  const handleCopyTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);

    if (task) {
      const copyTitle = `Копия: ${task.title}`;

      const newTask = TaskDataService.saveTask({
        ...task,
        title: copyTitle,
        status: "active",
        createdAt: new Date().toISOString(),
        completedDate: undefined,
      });

      setTasks((prev) => [...prev, newTask]);

      setNotification({
        open: true,
        message: "Задача успешно скопирована",
        severity: "success",
      });
    }
  };

  // Удаление задачи
  const handleDeleteTask = (taskId: string) => {
    TaskDataService.deleteTask(taskId);

    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    setNotification({
      open: true,
      message: "Задача удалена",
      severity: "success",
    });
  };

  // Закрытие уведомления
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h1">
          Мои задачи
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Создать задачу
        </Button>
      </Box>

      <Paper sx={{ width: "100%", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}
        >
          <Tab label="Все задачи" value="all" />
          <Tab label="Текущие" value="current" />
          <Tab label="Выполненные" value="completed" />
          <Tab label="Просроченные" value="overdue" />
        </Tabs>
      </Paper>

      <Box sx={{ width: "100%", mb: 3 }}>
        <TaskFilters filters={filters} onFiltersChange={handleFiltersChange} />
      </Box>

      {filteredTasks.length === 0 ? (
        <Paper sx={{ py: 4, textAlign: "center", width: "100%" }}>
          <Typography variant="body1" color="text.secondary">
            Нет задач, соответствующих выбранным фильтрам
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ width: "100%" }}>
          {filteredTasks.length === 1 ? (
            <Box sx={{ width: "100%" }}>
              <TaskCard
                task={filteredTasks[0]}
                onComplete={handleCompleteTask}
                onEdit={handleEditTask}
                onCopy={handleCopyTask}
                onDelete={handleDeleteTask}
              />
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ width: "100%" }}>
              {filteredTasks.map((task) => (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={4}
                  key={task.id}
                  sx={{ width: "100%" }}
                >
                  <TaskCard
                    task={task}
                    onComplete={handleCompleteTask}
                    onEdit={handleEditTask}
                    onCopy={handleCopyTask}
                    onDelete={handleDeleteTask}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      <TaskForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSaveTask}
        task={editTask}
        isEdit={!!editTask}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TasksPage;
