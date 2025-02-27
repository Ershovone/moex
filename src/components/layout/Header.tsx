// src/components/layout/Header.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { ExitToApp as ExitToAppIcon } from "@mui/icons-material";
import { NotificationPanel } from "../features/notifications";
import { useNotifications } from "../../contexts/NotificationContext";
import { styled } from "@mui/material/styles";

const Logo = styled("img")({
  height: 60,
  marginRight: 16,
});

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName = "Иванов И.И." }) => {
  const {
    notificationState,
    markAsRead,
    markAllAsRead,
    handleNotificationClick,
  } = useNotifications();

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "white",
        color: "black",
        height: "64px",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 1.5 }}>
            <Logo src="/logo.png" alt="MOEX" />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 500,
              fontSize: "1.25rem",
              marginLeft: "8px",
              color: "#333",
            }}
          >
            Витрина услуг
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <NotificationPanel
            notifications={notificationState.notifications}
            unreadCount={notificationState.unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onNotificationClick={handleNotificationClick}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 2,
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: "0.875rem",
                bgcolor: "#e0e0e0",
                color: "#333",
                mr: 1,
              }}
            >
              {userName.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {userName}
            </Typography>
          </Box>

          <IconButton color="inherit" size="small">
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
