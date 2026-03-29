import * as React from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Divider,
  Stack,
} from "@mui/material";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/checkout";

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    dispatch(login({ email }));

    navigate(from, { replace: true });
  };

  const handleGoogleLogin = () => {
    dispatch(login({ email: "googleuser@example.com" }));
    navigate(from, { replace: true });
  };

  const handleFacebookLogin = () => {
    dispatch(login({ email: "facebookuser@example.com" }));
    navigate(from, { replace: true });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            margin="normal"
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Sign In
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Stack spacing={2}>
          <Button variant="outlined" fullWidth onClick={handleGoogleLogin}>
            Sign in with Google
          </Button>
          <Button variant="outlined" fullWidth onClick={handleFacebookLogin}>
            Sign in with Facebook
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
