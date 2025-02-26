// src/components/features/tasks/TaskForm.tsx

import { FC, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
} from "@mui/material";
import { Task, TaskPriority } from "../../../types/task";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task;
  isEdit?: boolean;
}

const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
  { value: "urgent", label: "Вне очереди" },
  { value: "high", label: "Высокий" },
  { value: "medium", label: "Средний" },
  { value: "low", label: "Низкий" },
];

const TaskForm: FC<TaskFormProps> = ({
  open,
  onClose,
  onSave,
  task,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: undefined,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : undefined,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: undefined,
      });
    }
  }, [task, open]);

  const handleChange =
    (field: keyof Task) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEdit ? "Редактирование задачи" : "Создание задачи"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название"
                value={formData.title || ""}
                onChange={handleChange("title")}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                value={formData.description || ""}
                onChange={handleChange("description")}
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Приоритет"
                value={formData.priority || "medium"}
                onChange={handleChange("priority")}
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Срок выполнения"
                type="date"
                value={formData.dueDate || ""}
                onChange={handleChange("dueDate")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.title}
        >
          {isEdit ? "Сохранить" : "Создать"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
