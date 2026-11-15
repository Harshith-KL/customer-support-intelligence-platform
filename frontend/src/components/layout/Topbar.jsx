
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import { MenuRounded } from "@mui/icons-material";

function Topbar({ onMenuClick }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: "1px solid #E2E8F0",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={onMenuClick}
            sx={{ display: { md: "none" } }}
          >
            <MenuRounded />
          </IconButton>

          <Typography fontWeight={600} color="text.primary">
            Customer Support Workspace
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
            <Typography variant="body2" fontWeight={600}>
              Support Admin
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Administrator
            </Typography>
          </Box>

          <Avatar sx={{ bgcolor: "primary.main" }}>
            SA
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
