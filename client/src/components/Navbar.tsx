import React from "react";
import { AppBar, Typography, Box, Toolbar, Avatar, Button, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { deepPurple } from "@mui/material/colors";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

import { getUser } from "../api";
import memoriesLogo from "../assets/memoriesLogo.png";
import memoriesText from "../assets/memoriesText.png";
import { isExpiredToken } from "../helpers";

export default function Navbar() {
  const { data: user, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!Cookies.get("token"),
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleSignOut = () => {
    Cookies.remove("token");
    queryClient.clear();
    navigate("/auth");
  };

  React.useEffect(() => {
    (async () => {
      const isExpired = await isExpiredToken(Cookies.get("token")!);
      if (isError && isExpired) handleSignOut();
    })();
  }, [isError]);

  return (
    <AppBar
      sx={{
        py: 1,
        borderRadius: 5,
        marginBottom: 4,
      }}
      position="static"
      color="inherit"
    >
      <Toolbar>
        <IconButton sx={{ marginRight: "auto" }} onClick={() => navigate("/")} disableRipple>
          <img src={memoriesText} alt="memories" height={45} />
          <img
            src={memoriesLogo}
            alt="memories"
            height={40}
            style={{ marginTop: "5px", marginLeft: "10px" }}
          />
        </IconButton>
        {user ? (
          <Box
            display="flex"
            justifyContent={{ xs: "flex-end", sm: "center" }}
            gap={2}
            alignItems="center"
          >
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
                color: (theme) => theme.palette.getContrastText(deepPurple[500]),
              }}
              src={user.picture}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Typography display="flex" alignItems="center" variant="h6">
              {user.name}
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Box>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary">
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
