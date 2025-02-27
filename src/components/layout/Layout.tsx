import { NotificationPanel } from "../features/notifications";
import { useNotifications } from "../../contexts/NotificationContext";
import { FC, ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  ListItemButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Task as TaskIcon,
  AdminPanelSettings as AdminIcon,
  Support as SupportIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { text: "Системы", icon: <DashboardIcon />, path: "/systems" },
  { text: "Услуги", icon: <AssignmentIcon />, path: "/services" },
  { text: "Заявки", icon: <AssignmentIcon />, path: "/requests" },
  { text: "Задачи", icon: <TaskIcon />, path: "/tasks" },
  {
    text: "Техническая поддержка",
    icon: <SupportIcon />,
    path: "/support",
    supportSpecialist: true,
  },
  {
    text: "Администрирование",
    icon: <AdminIcon />,
    path: "/admin",
    admin: true,
  },
];

const Layout: FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем доступ к контексту уведомлений
  const {
    notificationState,
    markAsRead,
    markAllAsRead,
    handleNotificationClick,
  } = useNotifications();

  // В реальном приложении это должно приходить из контекста аутентификации
  const isAdmin = true; // Временно включим для всех
  const isSupportSpecialist = true; // Временно включим для всех

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          MOEX Services
        </Typography>
      </Toolbar>
      <List>
        {menuItems
          .filter(
            (item) =>
              (!item.admin || isAdmin) &&
              (!item.supportSpecialist || isSupportSpecialist)
          )
          .map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false); // Закрываем мобильное меню при переходе
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
          color: "black",
          height: "64px", // Фиксированная высота AppBar
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <NotificationPanel
            notifications={notificationState.notifications}
            unreadCount={notificationState.unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onNotificationClick={handleNotificationClick}
          />
          <Avatar sx={{ ml: 1 }}>ИИ</Avatar>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: 0,
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: "auto", // Добавляем прокрутку для основного контента
          height: "100vh",
          width: "100vw",
          pt: "64px", // Отступ для AppBar
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: "1200px" },
            p: 3, // Внутренний отступ со всех сторон
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
