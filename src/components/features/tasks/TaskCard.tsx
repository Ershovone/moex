// src/components/features/tasks/TaskCard.tsx

import { FC, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Button,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { TaskCardProps, TaskPriority, TaskStatus } from "../../../types/task";

const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    urgent: "#ff1744",
    high: "#f57c00",
    medium: "#ffb74d",
    low: "#81c784",
  };
  return colors[priority];
};

const getStatusColor = (
  status: TaskStatus
): "success" | "error" | "warning" | "default" => {
  const colors: Record<
    TaskStatus,
    "success" | "error" | "warning" | "default"
  > = {
    active: "warning",
    completed: "success",
    overdue: "error",
  };
  return colors[status];
};

const TaskCard: FC<TaskCardProps> = ({
  task,
  onComplete,
  onEdit,
  onCopy,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
      }}
    >
      <CardContent sx={{ flexGrow: 1, px: 3, py: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {task.number}
          </Typography>
          <Box>
            <Chip
              label={
                task.status === "active"
                  ? "Активная"
                  : task.status === "completed"
                  ? "Выполнена"
                  : "Просрочена"
              }
              color={getStatusColor(task.status)}
              size="small"
              sx={{ mr: 1 }}
            />
            <IconButton
              size="small"
              onClick={handleMenuClick}
              aria-controls={open ? "task-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
              id="task-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                "aria-labelledby": "task-menu-button",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onEdit(task.id);
                }}
              >
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Редактировать
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onCopy(task.id);
                }}
              >
                <CopyIcon fontSize="small" sx={{ mr: 1 }} />
                Копировать
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  onDelete(task.id);
                }}
              >
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Удалить
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {task.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Автор:</strong> {task.author}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Исполнитель:</strong> {task.assignee}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Категория:</strong> {task.category}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Создано: {new Date(task.createdAt).toLocaleDateString()}
          </Typography>
          {task.dueDate && (
            <Typography
              variant="body2"
              color={task.status === "overdue" ? "error" : "text.secondary"}
              sx={{ mb: 0.5 }}
            >
              Срок: {new Date(task.dueDate).toLocaleDateString()}
              {task.daysLeft !== undefined &&
                task.status !== "completed" &&
                (task.daysLeft >= 0
                  ? ` (осталось ${task.daysLeft} дн.)`
                  : ` (просрочено на ${Math.abs(task.daysLeft)} дн.)`)}
            </Typography>
          )}
        </Box>

        {task.source && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Источник:</strong> {task.source}
          </Typography>
        )}

        <Box
          sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}
        >
          {task.url && (
            <Link
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />
              Ссылка
            </Link>
          )}

          {task.status !== "completed" && (
            <Button
              startIcon={<CheckCircleIcon />}
              variant="outlined"
              color="success"
              size="small"
              onClick={() => onComplete(task.id)}
            >
              Выполнить
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
