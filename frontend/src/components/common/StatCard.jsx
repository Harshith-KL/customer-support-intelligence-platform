
import {
    Card,
    CardContent,
    Box,
    Typography,
} from "@mui/material";

function StatCard({ title, value, icon, color }) {
    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>

                        <Typography variant="h4" sx={{ mt: 1 }}>
                            {value}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: `${color}15`,
                            color,
                            borderRadius: 3,
                            p: 1.5,
                            display: "flex",
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default StatCard;
