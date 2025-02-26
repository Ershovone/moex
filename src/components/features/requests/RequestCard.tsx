// src/components/features/requests/RequestCard.tsx

import { FC } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  IconButton,
  Button
} from '@mui/material';
import { 
  OpenInNew as OpenInNewIcon,
  MoreVert as MoreVertIcon 
} from '@mui/icons-material';
import { RequestCardProps, RequestStatus } from '../../../types/request';

type StatusColor = 'info' | 'warning' | 'success' | 'error' | 'default';

const getStatusColor = (status: RequestStatus): StatusColor => {
  const statusColors: Record<RequestStatus, StatusColor> = {
    new: 'info',
    in_progress: 'warning',
    on_approval: 'warning',
    completed: 'success',
    closed: 'default',
    cancelled: 'error'
  };
  return statusColors[status];
}

const getStatusText = (status: RequestStatus): string => {
  const statusTexts: Record<RequestStatus, string> = {
    new: 'Новая',
    in_progress: 'В работе',
    on_approval: 'На согласовании',
    completed: 'Выполнена',
    closed: 'Закрыта',
    cancelled: 'Отменена'
  };
  return statusTexts[status];
};

const RequestCard: FC<RequestCardProps> = ({ request, onSelect }) => {
  const { 
    number,
    systemName,
    typeName,
    content,
    status,
    authorName,
    executorName,
    createdAt,
    plannedDate
  } = request;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {systemName}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {number}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Chip 
              label={getStatusText(status)}
              color={getStatusColor(status)}
              size="small"
            />
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body1" gutterBottom>
          {typeName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {content}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Автор:</strong> {authorName}
          </Typography>
          {executorName && (
            <Typography variant="body2">
              <strong>Исполнитель:</strong> {executorName}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Создано: {new Date(createdAt).toLocaleDateString()}
          </Typography>
          {plannedDate && (
            <Typography variant="body2" color="text.secondary">
              План: {new Date(plannedDate).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="text"
            endIcon={<OpenInNewIcon />}
            onClick={() => onSelect(request)}
          >
            Открыть
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RequestCard;