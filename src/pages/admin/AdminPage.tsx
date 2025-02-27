// src/pages/admin/AdminPage.tsx

import { FC, useState } from "react";
import { Box, Tabs, Tab, Snackbar, Alert } from "@mui/material";
import {
  Settings as SettingsIcon,
  Apps as AppsIcon,
  Computer as ComputerIcon,
  Assignment as AssignmentIcon,
  Task as TaskIcon,
} from "@mui/icons-material";
import {
  ConfigItemsList,
  ConfigItemForm,
  GlobalParameters,
} from "../../components/features/admin";
import { ConfigItem, GlobalParameter, UserGroup } from "../../types/admin";

// Моковые данные
const MOCK_USER_GROUPS: UserGroup[] = [
  { id: "admin", name: "Администраторы", source: "ad" },
  { id: "tech-support", name: "Техническая поддержка", source: "ad" },
  { id: "users", name: "Пользователи", source: "ad" },
];

const MOCK_SERVICES: ConfigItem[] = [
  {
    id: "service-1",
    name: "Услуги по работе с персоналом (HRSM)",
    description: "Услуги HR департамента",
    published: true,
    order: 1,
    url: "#",
    type: "service",
    adminGroups: ["admin"],
    userGroups: ["users"],
  },
  {
    id: "service-2",
    name: "Услуги АХО (MPG)",
    description: "Услуги административно-хозяйственного отдела",
    published: true,
    order: 2,
    url: "#",
    type: "service",
    adminGroups: ["admin"],
    userGroups: ["users"],
  },
];

const MOCK_SYSTEMS: ConfigItem[] = [
  {
    id: "system-1",
    name: "ITSM",
    description: "Система управления ИТ-услугами",
    published: true,
    order: 1,
    url: "#",
    type: "system",
    adminGroups: ["admin"],
    userGroups: ["users"],
  },
  {
    id: "system-2",
    name: "HRSM",
    description: "Система управления персоналом",
    published: true,
    order: 2,
    url: "#",
    type: "system",
    adminGroups: ["admin"],
    userGroups: ["users"],
  },
];

const MOCK_GLOBAL_PARAMETERS: GlobalParameter[] = [
  {
    id: "param-1",
    name: "Срок хранения завершённых заявок",
    description: "Количество дней хранения заявок",
    value: 90,
    type: "number",
  },
  {
    id: "param-2",
    name: "Срок хранения завершённых задач",
    description: "Количество дней хранения задач",
    value: 90,
    type: "number",
  },
  {
    id: "param-3",
    name: "Срок хранения нотификаций",
    description: "Количество дней хранения нотификаций",
    value: 30,
    type: "number",
  },
  {
    id: "param-4",
    name: "Обязательные атрибуты задач",
    description: "Атрибуты, которые должны быть заполнены",
    value: ["title", "priority"],
    type: "array",
  },
  {
    id: "param-5",
    name: "Специалисты технической поддержки",
    description: "Список пользователей с правами тех. поддержки",
    value: ["user1", "user2"],
    type: "array",
  },
  {
    id: "param-6",
    name: "Администраторы",
    description: "Пользователи с правами администратора",
    value: ["admin1", "admin2"],
    type: "array",
  },
];

type AdminTab = "services" | "systems" | "requests" | "tasks" | "parameters";

const AdminPage: FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("services");
  const [services, setServices] = useState<ConfigItem[]>(MOCK_SERVICES);
  const [systems, setSystems] = useState<ConfigItem[]>(MOCK_SYSTEMS);
  const [requests, setRequests] = useState<ConfigItem[]>([]);
  const [tasks, setTasks] = useState<ConfigItem[]>([]);
  const [globalParameters, setGlobalParameters] = useState<GlobalParameter[]>(
    MOCK_GLOBAL_PARAMETERS
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<ConfigItem | undefined>(undefined);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: AdminTab) => {
    setActiveTab(newValue);
  };

  const handleAddItem = () => {
    setEditItem(undefined);
    setFormOpen(true);
  };

  const handleEditItem = (item: ConfigItem) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleCopyItem = (item: ConfigItem) => {
    const newItem = {
      ...item,
      id: `${item.type}-${Date.now()}`,
      name: `Копия: ${item.name}`,
    };

    saveItem(newItem);

    setNotification({
      open: true,
      message: "Элемент успешно скопирован",
      severity: "success",
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const itemType =
      activeTab === "services"
        ? "service"
        : activeTab === "systems"
        ? "system"
        : activeTab === "requests"
        ? "request"
        : "task";

    let updatedItems: ConfigItem[] = [];

    switch (itemType) {
      case "service":
        updatedItems = services.filter((item) => item.id !== itemId);
        setServices(updatedItems);
        break;
      case "system":
        updatedItems = systems.filter((item) => item.id !== itemId);
        setSystems(updatedItems);
        break;
      case "request":
        updatedItems = requests.filter((item) => item.id !== itemId);
        setRequests(updatedItems);
        break;
      case "task":
        updatedItems = tasks.filter((item) => item.id !== itemId);
        setTasks(updatedItems);
        break;
    }

    setNotification({
      open: true,
      message: "Элемент успешно удален",
      severity: "success",
    });
  };

  const handleTogglePublished = (itemId: string, published: boolean) => {
    const updateItem = (items: ConfigItem[]): ConfigItem[] =>
      items.map((item) => (item.id === itemId ? { ...item, published } : item));

    switch (activeTab) {
      case "services":
        setServices(updateItem(services));
        break;
      case "systems":
        setSystems(updateItem(systems));
        break;
      case "requests":
        setRequests(updateItem(requests));
        break;
      case "tasks":
        setTasks(updateItem(tasks));
        break;
    }
  };

  const saveItem = (item: ConfigItem) => {
    const updateItems = (
      items: ConfigItem[],
      newItem: ConfigItem
    ): ConfigItem[] => {
      const existingItemIndex = items.findIndex((i) => i.id === newItem.id);
      if (existingItemIndex >= 0) {
        return items.map((i) => (i.id === newItem.id ? newItem : i));
      } else {
        return [...items, newItem];
      }
    };

    switch (item.type) {
      case "service":
        setServices(updateItems(services, item));
        break;
      case "system":
        setSystems(updateItems(systems, item));
        break;
      case "request":
        setRequests(updateItems(requests, item));
        break;
      case "task":
        setTasks(updateItems(tasks, item));
        break;
    }

    setNotification({
      open: true,
      message: editItem ? "Элемент успешно обновлен" : "Элемент успешно создан",
      severity: "success",
    });
  };

  const handleSaveParameters = (params: GlobalParameter[]) => {
    setGlobalParameters(params);
    setNotification({
      open: true,
      message: "Параметры успешно сохранены",
      severity: "success",
    });
  };

  const getParentItems = (): ConfigItem[] => {
    switch (activeTab) {
      case "services":
        return services;
      case "systems":
        return systems;
      case "requests":
        return requests;
      case "tasks":
        return tasks;
      default:
        return [];
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Box sx={{ width: "100%", mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="admin tabs"
          >
            <Tab
              icon={<AppsIcon />}
              iconPosition="start"
              label="Услуги"
              value="services"
            />
            <Tab
              icon={<ComputerIcon />}
              iconPosition="start"
              label="Системы"
              value="systems"
            />
            <Tab
              icon={<AssignmentIcon />}
              iconPosition="start"
              label="Заявки"
              value="requests"
            />
            <Tab
              icon={<TaskIcon />}
              iconPosition="start"
              label="Задачи"
              value="tasks"
            />
            <Tab
              icon={<SettingsIcon />}
              iconPosition="start"
              label="Параметры"
              value="parameters"
            />
          </Tabs>
        </Box>

        {activeTab === "services" && (
          <ConfigItemsList
            items={services}
            title="Каталог услуг"
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onCopyItem={handleCopyItem}
            onDeleteItem={handleDeleteItem}
            onTogglePublished={handleTogglePublished}
          />
        )}

        {activeTab === "systems" && (
          <ConfigItemsList
            items={systems}
            title="Каталог систем"
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onCopyItem={handleCopyItem}
            onDeleteItem={handleDeleteItem}
            onTogglePublished={handleTogglePublished}
          />
        )}

        {activeTab === "requests" && (
          <ConfigItemsList
            items={requests}
            title="Конфигурируемые элементы страницы Заявки"
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onCopyItem={handleCopyItem}
            onDeleteItem={handleDeleteItem}
            onTogglePublished={handleTogglePublished}
          />
        )}

        {activeTab === "tasks" && (
          <ConfigItemsList
            items={tasks}
            title="Конфигурируемые элементы страницы Задачи"
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onCopyItem={handleCopyItem}
            onDeleteItem={handleDeleteItem}
            onTogglePublished={handleTogglePublished}
          />
        )}

        {activeTab === "parameters" && (
          <GlobalParameters
            parameters={globalParameters}
            onSave={handleSaveParameters}
          />
        )}
      </Box>

      <ConfigItemForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={saveItem}
        item={editItem}
        isEdit={!!editItem}
        parentItems={getParentItems()}
        userGroups={MOCK_USER_GROUPS}
        itemType={
          activeTab === "services"
            ? "service"
            : activeTab === "systems"
            ? "system"
            : activeTab === "requests"
            ? "request"
            : "task"
        }
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
    </>
  );
};

export default AdminPage;
