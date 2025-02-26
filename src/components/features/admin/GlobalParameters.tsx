// src/components/features/admin/GlobalParameters.tsx

import { FC, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Switch,
} from "@mui/material";
import { Save as SaveIcon, Edit as EditIcon } from "@mui/icons-material";
import { GlobalParameter } from "../../../types/admin";

interface GlobalParametersProps {
  parameters: GlobalParameter[];
  onSave: (parameters: GlobalParameter[]) => void;
}

const GlobalParameters: FC<GlobalParametersProps> = ({
  parameters,
  onSave,
}) => {
  const [editingIds, setEditingIds] = useState<string[]>([]);
  const [updatedParams, setUpdatedParams] = useState<
    Record<string, GlobalParameter>
  >({});

  const startEditing = (id: string) => {
    setEditingIds((prev) => [...prev, id]);
    setUpdatedParams((prev) => ({
      ...prev,
      [id]: { ...parameters.find((p) => p.id === id)! },
    }));
  };

  const cancelEditing = (id: string) => {
    setEditingIds((prev) => prev.filter((eId) => eId !== id));
    setUpdatedParams((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleSave = () => {
    const updatedParameters = parameters.map((param) => {
      if (updatedParams[param.id]) {
        return updatedParams[param.id];
      }
      return param;
    });
    onSave(updatedParameters);
    setEditingIds([]);
    setUpdatedParams({});
  };

  const handleChange =
    (id: string, field: keyof GlobalParameter) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | { name?: string; value: unknown }
      >
    ) => {
      let value: any = event.target.value;

      // Преобразуем значение в зависимости от типа параметра
      const param = parameters.find((p) => p.id === id);
      if (param) {
        if (param.type === "number") {
          value = Number(value);
        } else if (param.type === "boolean") {
          value = Boolean(value);
        } else if (param.type === "array" && typeof value === "string") {
          value = value.split(",").map((v) => v.trim());
        }
      }

      setUpdatedParams((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      }));
    };

  const handleSwitchChange =
    (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setUpdatedParams((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          value: event.target.checked,
        },
      }));
    };

  const isEditing = (id: string) => editingIds.includes(id);

  const renderValue = (param: GlobalParameter) => {
    const currentParam = updatedParams[param.id] || param;

    if (isEditing(param.id)) {
      if (param.type === "boolean") {
        return (
          <Switch
            checked={Boolean(currentParam.value)}
            onChange={handleSwitchChange(param.id)}
          />
        );
      } else if (param.type === "number") {
        return (
          <TextField
            type="number"
            value={currentParam.value}
            onChange={handleChange(param.id, "value")}
            fullWidth
          />
        );
      } else if (param.type === "array") {
        return (
          <TextField
            value={
              Array.isArray(currentParam.value)
                ? currentParam.value.join(", ")
                : currentParam.value
            }
            onChange={handleChange(param.id, "value")}
            fullWidth
            multiline
            helperText="Введите значения через запятую"
          />
        );
      } else {
        return (
          <TextField
            value={currentParam.value}
            onChange={handleChange(param.id, "value")}
            fullWidth
          />
        );
      }
    } else {
      if (param.type === "boolean") {
        return <Switch checked={Boolean(param.value)} disabled />;
      } else if (param.type === "array") {
        return (
          <span>
            {Array.isArray(param.value)
              ? param.value.join(", ")
              : JSON.stringify(param.value)}
          </span>
        );
      } else {
        return <span>{String(param.value)}</span>;
      }
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Глобальные параметры</Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={Object.keys(updatedParams).length === 0}
        >
          Сохранить изменения
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Значение</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.map((param) => (
              <TableRow key={param.id}>
                <TableCell>{param.name}</TableCell>
                <TableCell>{param.description || "-"}</TableCell>
                <TableCell>
                  {param.type === "string" && "Строка"}
                  {param.type === "number" && "Число"}
                  {param.type === "boolean" && "Логическое"}
                  {param.type === "array" && "Массив"}
                </TableCell>
                <TableCell>{renderValue(param)}</TableCell>
                <TableCell>
                  {isEditing(param.id) ? (
                    <Button
                      size="small"
                      onClick={() => cancelEditing(param.id)}
                    >
                      Отменить
                    </Button>
                  ) : (
                    <IconButton
                      size="small"
                      onClick={() => startEditing(param.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GlobalParameters;
