import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h2" sx={{ mb: 3, textAlign: "center" }}>
        404 - Page Not Found
      </Typography>
      <Box
        component="img"
        src="notfound.jpg"
        alt="Page not found"
        sx={{
          width: "100%",
          maxWidth: { xs: "450px", sm: "600px", md: "800px" },
          minWidth: { xs: "300px" },
          height: "auto",
          mb: 3,
        }}
      />
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          mt: 2,
          backgroundColor: "#00674F",
          color: "white",
          "&:hover": {
            backgroundColor: "#005F45", // Un tono más oscuro para el hover
          },
        }}
      >
        Back to Home
      </Button>
    </Container>
  );
};

export default NotFound;