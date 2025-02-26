// src/components/features/systems/SystemCard.tsx

import { FC } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import { SystemCardProps } from "../../../types/system";

const SystemCard: FC<SystemCardProps> = ({ name, description, url }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="text"
            endIcon={<OpenInNewIcon />}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Перейти
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SystemCard;
