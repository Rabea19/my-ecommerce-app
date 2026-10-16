import * as React from "react";
import { api } from "../lib/api";
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
  const [register, setRegister] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/checkout";

  const handleSubmit = async (e) => {
    e.preventDefault(); if (busy) return;
    const form = new FormData(e.currentTarget); setBusy(true); setError("");
    const {data, error} = await api.auth[register ? "signUp" : "signInWithPassword"]({email:form.get("email"), password:form.get("password")});
    setBusy(false); if (error) { setError(error.message); return; }
    dispatch(login(data.user)); navigate(from, {replace:true});
  };
  const handleGoogleLogin = () => setError("Google sign-in is not configured. Please use email and password.");
  const handleFacebookLogin = () => setError("Facebook sign-in is not configured. Please use email and password.");

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {register ? "Create Account" : "Sign In"}
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

          <Button disabled={busy} type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            {register ? "Create Account" : "Sign In"}
          </Button>
        </Box>

        {error && <Typography role="alert" color="error" sx={{mt:2}}>{error}</Typography>}
        <Button fullWidth onClick={() => { setRegister(!register); setError(""); }}>
          {register ? "Already registered? Sign In" : "Create an account"}
        </Button>
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
