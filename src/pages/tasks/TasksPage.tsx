// src/pages/tasks/TasksPage.tsx

import { FC, useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab,
  Paper,
  Button,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TaskCard, TaskFilters, TaskForm } from '../../components/features/tasks';
import { Task, TasksFilters } from '../../types/task';

// Моковые данные для примера
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    number: 'TASK-2024-001',
    title: 'Заказать подарки детям сотрудников на НГ',
    description: 'Заказ подарков',
    assignee: 'Иванов И.И.',
    author: 'Петров П.П.',
    priority: 'high',
    category: 'Заказ подарков',
    createdAt: '2024-02-20T10:00:00',
    dueDate: '2024-03-01T00:00:00',
    status: 'active',
    daysLeft: 5,
    source: 'ITSM',
    url: '#'
  },
  {
    id: '2',
    number: 'TASK-2024-002',
    title: 'Оставить отзыв на перевод техники',
    description: 'Оставить отзыв',
    assignee: 'Иванов И.И.',
    author: 'Сидоров С.С.',
    priority: 'medium',
    category: 'Оставить отзыв',
    createdAt: '2024-02-18T10:00:00',
    dueDate: '2024-02-25T00:00:00',
    completedDate: '2024-02-24T00:00:00',
    status: 'completed',
    source: 'MPG',
    url: '#'
  },
  {
    id: '3',
    number: 'TASK-2024-003',
    title: 'Инструктаж по ТБ',
    description: 'Пройти инструктаж',
    assignee: 'Иванов И.И.',
    author: 'Система',
    priority: 'medium',
    category: 'Инструктаж',
    createdAt: '2024-02-15T10:00:00',
    dueDate: '2024-02-20T00:00:00',
    status: 'overdue',
    daysLeft: -5,
    source: 'Progress',
    url: '#'
  }
];

type TaskTab = 'all' | 'current' | 'completed' | 'overdue';

const TasksPage: FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(MOCK_TASKS);
  const [activeTab, setActiveTab] = useState<TaskTab>('current');
  const [filters, setFilters] = useState<TasksFilters>({
    search: '',
    status: undefined,
    priority: undefined
  });
  const [openForm, setOpenForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: TaskTab) => {
    setActiveTab(newValue);
  };

  const handleFiltersChange = (newFilters: TasksFilters) => {
    setFilters(newFilters);
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Фильтр по вкладке
    if (activeTab === 'current') {
      filtered = filtered.filter(task => task.status === 'active');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(task => task.status === 'completed');
    } else if (activeTab === 'overdue') {
      filtered = filtered.filter(task => task.status === 'overdue');
    }

    // Фильтр по строке поиска
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.number.toLowerCase().includes(searchLower)
      );
    }

    // Фильтр по статусу
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Фильтр по приоритету
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    setFilteredTasks(filtered);
  };

  useEffect(() => {
    filterTasks();
  }, [activeTab, filters, tasks]);

  const handleOpenForm = () => {
    setEditTask(undefined);
    setOpenForm(true);
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditTask(task);
      setOpenForm(true);
    }
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      // Редактирование существующей задачи
      setTasks(prev => prev.map(task => 
        task.id === taskData.id ? { ...task, ...taskData } : task
      ));
      setNotification({
        open: true,
        message: 'Задача успешно обновлена',
        severity: 'success'
      });
    } else {
      // Создание новой задачи
      const newTask: Task = {
        id: `task-${Date.now()}`,
        number: `TASK-${Date.now()}`,
        title: taskData.title || 'Новая задача',
        description: taskData.description || '',
        assignee: 'Иванов И.И.',
        author: 'Иванов И.И.',
        priority: taskData.priority || 'medium',
        category: 'Задача',
        createdAt: new Date().toISOString(),
        dueDate: taskData.dueDate,
        status: 'active',
        daysLeft: taskData.dueDate 
          ? Math.ceil((new Date(taskData.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : undefined
      };
      setTasks(prev => [...prev, newTask]);
      setNotification({
        open: true,
        message: 'Задача успешно создана',
        severity: 'success'
      });
    }
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', completedDate: new Date().toISOString() } 
        : task
    ));
    setNotification({
      open: true,
      message: 'Задача помечена как выполненная',
      severity: 'success'
    });
  };

  const handleCopyTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        number: `TASK-${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString(),
        completedDate: undefined,
        title: `Копия: ${task.title}`
      };
      setTasks(prev => [...prev, newTask]);
      setNotification({
        open: true,
        message: 'Задача успешно скопирована',
        severity: 'success'
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setNotification({
      open: true,
      message: 'Задача удалена',
      severity: 'success'
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          width: '100%'
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

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}
        >
          <Tab label="Все задачи" value="all" />
          <Tab label="Текущие" value="current" />
          <Tab label="Выполненные" value="completed" />
          <Tab label="Просроченные" value="overdue" />
        </Tabs>
      </Paper>

      <Box sx={{ width: '100%', mb: 3 }}>
        <TaskFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </Box>

      {filteredTasks.length === 0 ? (
        <Paper sx={{ py: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            Нет задач, соответствующих выбранным фильтрам
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ width: '100%' }}>
          {filteredTasks.length === 1 ? (
            <Box sx={{ width: '100%' }}>
              <TaskCard
                task={filteredTasks[0]}
                onComplete={handleCompleteTask}
                onEdit={handleEditTask}
                onCopy={handleCopyTask}
                onDelete={handleDeleteTask}
              />
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ width: '100%' }}>
              {filteredTasks.map(task => (
                <Grid item xs={12} sm={12} md={6} lg={4} key={task.id} sx={{ width: '100%' }}>
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