import React from "react";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  useTheme,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";

import { SignUpSchema, SignInSchema } from "../schemas";
import AuthInput from "../components/Auth/AuthInput";
import { auth } from "../api";

function Auth() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { spacing } = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof SignUpSchema> | z.infer<typeof SignInSchema>) =>
      auth(data, isSignup),
    onSuccess: () => navigate("/"),
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpSchema> | z.infer<typeof SignInSchema>>({
    resolver: zodResolver(isSignup ? SignUpSchema : SignInSchema),
    shouldUnregister: true,
  });

  const onSubmit: SubmitHandler<z.infer<typeof SignUpSchema> | z.infer<typeof SignInSchema>> = (
    values
  ) => mutate(values);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      Cookies.set("token", tokenResponse.access_token);
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSwitchAuth = () => {
    setIsSignup((prev) => !prev);
    reset();
  };

  React.useEffect(() => {
    const token = Cookies.get("token");
    if (token) navigate("/");
  }, [navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}
        elevation={3}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">Sign {isSignup ? "up" : "in"}</Typography>
        <form
          style={{ width: "100%", marginTop: spacing(3) }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <AuthInput
                  type="text"
                  name="firstName"
                  label="First Name"
                  control={control}
                  errors={errors}
                  autoFocus
                  half
                />
                <AuthInput
                  type="text"
                  name="lastName"
                  label="Last Name"
                  control={control}
                  errors={errors}
                  half
                />
              </>
            )}
            <AuthInput type="email" name="email" label="Email" control={control} errors={errors} />
            <AuthInput
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              control={control}
              errors={errors}
              handleShowPassword={() => setShowPassword((prev) => !prev)}
            />
            {isSignup && (
              <AuthInput
                type="password"
                name="confirmPassword"
                label="Repeat Password"
                control={control}
                errors={errors}
              />
            )}
          </Grid>
          <Button
            disabled={isPending}
            sx={{ margin: spacing(3, 0, 1) }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign {isSignup ? "Up" : "In"}
          </Button>
          <Divider>OR</Divider>
          <Button
            sx={{ margin: spacing(1, 0, 2) }}
            startIcon={<GoogleIcon />}
            fullWidth
            variant="outlined"
            onClick={() => handleGoogleLogin()}
          >
            Continue with google
          </Button>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography>
              {isSignup ? "Already have an account?" : "Don't have an account?"}
            </Typography>
            <Button
              onClick={handleSwitchAuth}
              size="small"
              variant="text"
              disableRipple
              disableTouchRipple
              disableElevation
              sx={{ ":hover": { backgroundColor: "transparent" } }}
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default Auth;
