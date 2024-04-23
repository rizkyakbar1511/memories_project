import { Grid, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import Post from "./Post/Post";

import { getPosts } from "../../api";

function Posts() {
  const [searchParams] = useSearchParams();
  const { data, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(searchParams),
  });

  if (isPending) return <CircularProgress />;

  return (
    <Grid container spacing={3}>
      {data?.posts.map((post) => (
        <Grid key={post._id} item xs={12} sm={12} md={6} lg={4} xl={3}>
          <Post post={post} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Posts;
