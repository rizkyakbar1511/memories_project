import React from "react";
import {
  Container,
  Grow,
  Grid,
  Fab,
  Dialog,
  Paper,
  AppBar,
  TextField,
  Button,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import useStore from "../state/store";
import Posts from "../components/Posts/Posts";
import Form from "../components/Form";
import Pagination from "../components/Pagination";
import ChipInput from "../components/ChipInput";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
function Home() {
  const [chips, setChips] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { isDialogOpen, setisDialogOpen } = useStore((state) => state);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const handleSearchPost = () => {
    setSearchParams((prev) => {
      prev.set("searchQuery", searchTerm.trim());
      prev.set("tags", chips.join(","));
      return prev;
    });
  };

  const handleSubmitSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearchPost();
  };

  React.useEffect(() => {
    const tags = searchParams.get("tags");
    setSearchTerm(searchParams.get("searchQuery") || "");
    setChips(tags ? tags.split(",") : []);
  }, []);

  React.useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [searchParams]);

  return (
    <>
      <Grow in>
        <Container maxWidth="xl">
          <Grid container justifyContent="space-between" alignItems="stretch" spacing={3}>
            <Grid item xs={12} sm={6} md={9}>
              <Posts />
            </Grid>
            <Grid item xs={12} sm={6} md={3} display={{ xs: "none", sm: "block" }}>
              <AppBar
                sx={{ borderRadius: 1, marginBottom: 2, display: "flex", padding: 2, gap: 1 }}
                position="static"
                color="inherit"
                elevation={1}
              >
                <TextField
                  name="search"
                  variant="outlined"
                  label="Search Memories"
                  fullWidth
                  value={searchTerm}
                  onKeyDown={handleSubmitSearch}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ChipInput
                  value={chips}
                  onChange={(_, option) => setChips(option)}
                  label="Search by tags"
                  placeholder="Type and press Enter"
                />
                <Button onClick={handleSearchPost} variant="contained" color="primary">
                  Search
                </Button>
              </AppBar>
              <Form />
              <Paper>
                <Box display="flex" alignItems="center" justifyContent="center" mt={3} p={2}>
                  <Pagination />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Grow>
      <Fab
        sx={{
          display: { sm: "none" },
          position: "fixed",
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
        size="medium"
        color="primary"
        aria-label="add"
        onClick={() => setisDialogOpen(true)}
      >
        <EditIcon />
      </Fab>
      <Dialog onClose={() => setisDialogOpen(false)} open={isDialogOpen}>
        <Form />
      </Dialog>
    </>
  );
}

export default Home;
