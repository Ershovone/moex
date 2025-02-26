// src/components/features/requests/RequestTable.tsx

import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Link,
} from "@mui/material";
import {
  OpenInNew as OpenInNewIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { RequestStatus, RequestTableProps } from "../../../types/request";

type StatusColor = "info" | "warning" | "success" | "error" | "default";

const getStatusColor = (status: RequestStatus): StatusColor => {
  const statusColors: Record<RequestStatus, StatusColor> = {
    new: "info",
    in_progress: "warning",
    on_approval: "warning",
    completed: "success",
    closed: "default",
    cancelled: "error",
  };
  return statusColors[status];
};

const getStatusText = (status: RequestStatus): string => {
  const statusTexts: Record<RequestStatus, string> = {
    new: "Новая",
    in_progress: "В работе",
    on_approval: "На согласовании",
    completed: "Выполнена",
    closed: "Закрыта",
    cancelled: "Отменена",
  };
  return statusTexts[status];
};

const RequestTable: FC<RequestTableProps> = ({ requests, onSelect }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>№ / Система</TableCell>
            <TableCell>Автор / Документ</TableCell>
            <TableCell>Содержание</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Дата</TableCell>
            <TableCell>Срок</TableCell>
            <TableCell>Ответственный</TableCell>
            <TableCell width={90} align="center">
              Действия
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(request);
                  }}
                  sx={{ display: "block", mb: 0.5 }}
                >
                  {request.number}
                </Link>
                <span style={{ color: "text.secondary", fontSize: "0.875rem" }}>
                  {request.systemName}
                </span>
              </TableCell>
              <TableCell>
                <div>{request.authorName}</div>
                <div style={{ color: "text.secondary", fontSize: "0.875rem" }}>
                  {request.typeName}
                </div>
              </TableCell>
              <TableCell>{request.content}</TableCell>
              <TableCell>
                <Chip
                  label={getStatusText(request.status)}
                  color={getStatusColor(request.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {new Date(request.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {request.plannedDate &&
                  new Date(request.plannedDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{request.executorName}</TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onSelect(request)}>
                  <OpenInNewIcon />
                </IconButton>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestTable;
