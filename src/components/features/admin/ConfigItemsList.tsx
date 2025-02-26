// src/components/features/admin/ConfigItemsList.tsx

import { FC, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { ConfigItem } from "../../../types/admin";

interface ConfigItemsListProps {
  items: ConfigItem[];
  title: string;
  onAddItem: () => void;
  onEditItem: (item: ConfigItem) => void;
  onCopyItem: (item: ConfigItem) => void;
  onDeleteItem: (itemId: string) => void;
  onTogglePublished: (itemId: string, published: boolean) => void;
}

const ConfigItemsList: FC<ConfigItemsListProps> = ({
  items,
  title,
  onAddItem,
  onEditItem,
  onCopyItem,
  onDeleteItem,
  onTogglePublished,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<ConfigItem | null>(null);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    item: ConfigItem
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleEdit = () => {
    if (selectedItem) {
      onEditItem(selectedItem);
      handleMenuClose();
    }
  };

  const handleCopy = () => {
    if (selectedItem) {
      onCopyItem(selectedItem);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      onDeleteItem(selectedItem.id);
      handleMenuClose();
    }
  };

  return (
    <Paper sx={{ width: "100%", mb: 4, p: 2 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>{title}</h2>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddItem}>
          Добавить
        </Button>
      </div>

      <TextField
        fullWidth
        placeholder="Поиск..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Порядок</TableCell>
              <TableCell>Опубликовано</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description || "-"}</TableCell>
                <TableCell>{item.order}</TableCell>
                <TableCell>
                  <Switch
                    checked={item.published}
                    onChange={(e) =>
                      onTogglePublished(item.id, e.target.checked)
                    }
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, item)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        id="item-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Редактировать
        </MenuItem>
        <MenuItem onClick={handleCopy}>
          <CopyIcon fontSize="small" sx={{ mr: 1 }} />
          Создать копию
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Удалить
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default ConfigItemsList;
