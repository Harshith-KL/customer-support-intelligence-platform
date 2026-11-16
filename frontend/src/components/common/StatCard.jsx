
import { Box, Card, CardContent, Typography } from "@mui/material";

function StatCard({ title, value, icon, color }) {
  return (
    <Card
      sx={{
        height: "100%",
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5 },
          "&:last-child": { pb: { xs: 2, sm: 2.5 } },
        }}
      >
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
