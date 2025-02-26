// src/components/features/admin/ConfigItemForm.tsx

import { FC, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Autocomplete,
  Chip,
} from "@mui/material";
import { ConfigItem, UserGroup } from "../../../types/admin";

interface ConfigItemFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: ConfigItem) => void;
  item?: ConfigItem;
  isEdit?: boolean;
  parentItems?: ConfigItem[];
  userGroups?: UserGroup[];
  itemType: "service" | "system" | "request" | "task";
}

const ConfigItemForm: FC<ConfigItemFormProps> = ({
  open,
  onClose,
  onSave,
  item,
  isEdit = false,
  parentItems = [],
  userGroups = [],
  itemType,
}) => {
  const [formData, setFormData] = useState<Partial<ConfigItem>>({
    name: "",
    description: "",
    published: true,
    order: 0,
    type: itemType,
    adminGroups: [],
    userGroups: [],
  });

  const [inheritPermissions, setInheritPermissions] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
      });
      // Если у элемента есть родитель, предполагаем что наследование прав включено
      setInheritPermissions(!!item.parentId);
    } else {
      setFormData({
        name: "",
        description: "",
        published: true,
        order: 0,
        type: itemType,
        adminGroups: [],
        userGroups: [],
      });
      setInheritPermissions(false);
    }
  }, [item, itemType, open]);

  const handleChange =
    (field: keyof ConfigItem) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };

  const handleCheckboxChange =
    (field: keyof ConfigItem) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.checked,
      });
    };

  const handleParentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parentId = event.target.value;
    setFormData({
      ...formData,
      parentId: parentId || undefined,
    });

    if (parentId && inheritPermissions) {
      // Если выбран родитель и включено наследование прав,
      // то копируем права из родительского элемента
      const parent = parentItems.find((item) => item.id === parentId);
      if (parent) {
        setFormData((prev) => ({
          ...prev,
          adminGroups: parent.adminGroups,
          userGroups: parent.userGroups,
        }));
      }
    }
  };

  const handleInheritPermissionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    setInheritPermissions(checked);

    if (checked && formData.parentId) {
      // Если включено наследование прав и выбран родитель,
      // то копируем права из родительского элемента
      const parent = parentItems.find((item) => item.id === formData.parentId);
      if (parent) {
        setFormData((prev) => ({
          ...prev,
          adminGroups: parent.adminGroups,
          userGroups: parent.userGroups,
        }));
      }
    }
  };

  const handleSubmit = () => {
    const id = formData.id || `${itemType}-${Date.now()}`;
    onSave({
      ...formData,
      id,
      type: itemType,
    } as ConfigItem);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {isEdit ? "Редактирование элемента" : "Создание элемента"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название"
                value={formData.name || ""}
                onChange={handleChange("name")}
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
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="URL"
                value={formData.url || ""}
                onChange={handleChange("url")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Порядок отображения"
                type="number"
                value={formData.order || 0}
                onChange={handleChange("order")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Родительский элемент"
                value={formData.parentId || ""}
                onChange={handleParentChange}
              >
                <MenuItem value="">Нет родителя</MenuItem>
                {parentItems.map((parent) => (
                  <MenuItem
                    key={parent.id}
                    value={parent.id}
                    disabled={parent.id === formData.id} // Не даем выбрать себя в качестве родителя
                  >
                    {parent.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.published || false}
                    onChange={handleCheckboxChange("published")}
                  />
                }
                label="Опубликовать"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inheritPermissions}
                    onChange={handleInheritPermissionsChange}
                    disabled={!formData.parentId}
                  />
                }
                label="Применить права наследования вышестоящего объекта"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={userGroups}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name
                }
                value={userGroups.filter((group) =>
                  formData.userGroups?.includes(group.id)
                )}
                onChange={(_, newValue) => {
                  setFormData({
                    ...formData,
                    userGroups: newValue.map((item) => item.id),
                  });
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option.name} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Группы пользователей"
                    placeholder="Выберите группы"
                  />
                )}
                disabled={inheritPermissions}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={userGroups}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.name
                }
                value={userGroups.filter((group) =>
                  formData.adminGroups?.includes(group.id)
                )}
                onChange={(_, newValue) => {
                  setFormData({
                    ...formData,
                    adminGroups: newValue.map((item) => item.id),
                  });
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option.name} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Группы администраторов"
                    placeholder="Выберите группы"
                  />
                )}
                disabled={inheritPermissions}
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
          disabled={!formData.name}
        >
          {isEdit ? "Сохранить" : "Создать"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigItemForm;
