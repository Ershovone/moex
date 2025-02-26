// src/components/features/services/ServiceGroup.tsx

import { FC, useState } from "react";
import { Box, Typography, Grid, Collapse, IconButton } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import {
  ServiceGroup as ServiceGroupType,
  Service,
} from "../../../types/service";
import ServiceCard from "./ServiceCard";

interface ServiceGroupProps {
  group: ServiceGroupType;
  onSelectService: (service: Service) => void;
}

const ServiceGroup: FC<ServiceGroupProps> = ({ group, onSelectService }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          mb: 2,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Typography variant="h6" component="h2">
          {group.name}
        </Typography>
      </Box>
      <Collapse in={expanded}>
        <Grid container spacing={3}>
          {group.services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <ServiceCard service={service} onSelect={onSelectService} />
            </Grid>
          ))}
        </Grid>
        {group.subgroups?.map((subgroup) => (
          <Box sx={{ ml: 4 }} key={subgroup.id}>
            <ServiceGroup group={subgroup} onSelectService={onSelectService} />
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};

export default ServiceGroup;
