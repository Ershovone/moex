// src/components/features/services/ServiceCard.tsx

import { FC } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  OpenInNew as OpenInNewIcon,
  HelpOutline as HelpIcon,
  Feedback as FeedbackIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { ServiceCardProps } from "../../../types/service";

const ServiceCard: FC<ServiceCardProps> = ({ service, onSelect }) => {
  const { name, description, system, instructionUrl, feedbackUrl, popular } =
    service;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      {popular && (
        <StarIcon
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "warning.main",
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pt: popular ? 6 : 2 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {system}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            {instructionUrl && (
              <Tooltip title="Инструкция">
                <IconButton
                  size="small"
                  href={instructionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            )}
            {feedbackUrl && (
              <Tooltip title="Обратная связь">
                <IconButton
                  size="small"
                  href={feedbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FeedbackIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Button
            variant="text"
            endIcon={<OpenInNewIcon />}
            onClick={() => onSelect(service)}
          >
            Создать заявку
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
