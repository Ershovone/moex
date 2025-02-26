// src/components/features/support/UserInfo.tsx

import { FC } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import {
  Email as EmailIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { User } from "../../../types/support";

interface UserInfoProps {
  user: User;
}

const UserInfo: FC<UserInfoProps> = ({ user }) => {
  const { fullName, email, department, position } = user;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            fontSize: "2rem",
            bgcolor: "primary.main",
          }}
        >
          {fullName.charAt(0)}
        </Avatar>

        <Box flex={1} textAlign={{ xs: "center", sm: "left" }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {fullName}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center">
                <EmailIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">{email}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center">
                <BusinessIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">{department}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center">
                <WorkIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">{position}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserInfo;
