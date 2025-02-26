// src/components/features/notifications/NotificationPanel.tsx

import { FC, useState } from "react";
import {
  Box,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Button,
  Tabs,
  Tab,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { Notification } from "../../../types/notification";

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationPanel: FC<NotificationPanelProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [tabValue, setTabValue] = useState<"all" | "unread">("all");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "all" | "unread"
  ) => {
    setTabValue(newValue);
  };

  const open = Boolean(anchorEl);

  const filteredNotifications =
    tabValue === "all"
      ? notifications
      : notifications.filter((notification) => !notification.read);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <InfoIcon color="info" />;
      case "warning":
        return <WarningIcon color="warning" />;
      case "error":
        return <ErrorIcon color="error" />;
      case "success":
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 500,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Уведомления</Typography>
          <Button
            size="small"
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Отметить все как прочитанные
          </Button>
        </Box>

        <Divider />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Все" value="all" />
            <Tab
              label={`Непрочитанные (${unreadCount})`}
              value="unread"
              disabled={unreadCount === 0}
            />
          </Tabs>
        </Box>

        {filteredNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {tabValue === "all"
                ? "Нет уведомлений"
                : "Нет непрочитанных уведомлений"}
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 350, overflow: "auto" }}>
            {filteredNotifications.map((notification) => (
              <ListItem
                key={notification.id}
                alignItems="flex-start"
                sx={{
                  cursor: "pointer",
                  backgroundColor: notification.read
                    ? "transparent"
                    : "rgba(0, 0, 0, 0.04)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                  },
                }}
                secondaryAction={
                  notification.url && (
                    <Tooltip title="Перейти по ссылке">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNotificationClick(notification);
                        }}
                      >
                        <LinkIcon />
                      </IconButton>
                    </Tooltip>
                  )
                }
                onClick={() => {
                  if (!notification.read) {
                    onMarkAsRead(notification.id);
                  }
                  if (notification.url) {
                    onNotificationClick(notification);
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 42 }}>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="subtitle2" sx={{ mr: 1 }}>
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <CircleIcon
                          fontSize="small"
                          color="primary"
                          sx={{ width: 8, height: 8 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: "block" }}
                      >
                        {notification.description}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                        {notification.documentNumber &&
                          ` • №${notification.documentNumber}`}
                        {notification.system && ` • ${notification.system}`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
};

export default NotificationPanel;
