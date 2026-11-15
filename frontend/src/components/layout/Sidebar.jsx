
import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import {
    DashboardRounded,
    ConfirmationNumberRounded,
    PsychologyRounded,
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";

const drawerWidth = 250;

const navigation = [
    {
        title: "Dashboard",
        path: "/",
        icon: <DashboardRounded />,
    },
    {
        title: "Tickets",
        path: "/tickets",
        icon: <ConfirmationNumberRounded />,
    },
];

function Sidebar({ open, onClose, mobile }) {
    return (
        <Drawer
            variant={mobile ? "temporary" : "permanent"}
            open={mobile ? open : true}
            onClose={onClose}
            sx={{
                width: mobile ? "auto" : drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    borderRight: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                },
            }}
        >
            <Box sx={{ px: 3, py: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <PsychologyRounded color="primary" fontSize="large" />

                    <Box>
                        <Typography fontWeight={800} fontSize={16}>
                            SupportIQ
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            Intelligence Platform
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ px: 3, mt: 2, mb: 1, fontWeight: 700 }}
            >
                WORKSPACE
            </Typography>

            <List sx={{ px: 1.5 }}>
                {navigation.map((item) => (
                    <ListItemButton
                        key={item.path}
                        component={NavLink}
                        to={item.path}
                        end={item.path === "/"}
                        onClick={onClose}
                        sx={{
                            borderRadius: 2,
                            mb: 0.5,
                            color: "text.secondary",

                            "&.active": {
                                backgroundColor: "#EFF6FF",
                                color: "#2563EB",
                                "& .MuiListItemIcon-root": {
                                    color: "#2563EB",
                                },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.title}
                            slotProps={{
                                primary: {
                                    sx: {
                                        fontWeight: 600,
                                        fontSize: 14,
                                    },
                                },
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>

            <Box sx={{ mt: "auto", p: 3 }}>
                <Typography variant="caption" color="text.secondary">
                    Customer Support Intelligence
                </Typography>
            </Box>
        </Drawer>
    );
}

export default Sidebar;
