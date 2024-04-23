import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Typography,
  Chip,
  CardActionArea,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { z } from "zod";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";

import { PostSchema } from "../../../schemas";
import useStore from "../../../state/store";
import { deletePost, getUser, likePost } from "../../../api";
import { pluralize } from "../../../helpers";

// Create a Zod type alias for Post
const extendedPostSchema = PostSchema.extend({
  _id: z.string(),
  creator: z.string(),
  createdAt: z.date(),
  tags: z.array(z.string()),
  likes: z.string(),
});
type PostProps = {
  post: z.infer<typeof extendedPostSchema>;
};

function Post({ post }: PostProps) {
  const queryClient = useQueryClient();
  const { setPostId } = useStore((state) => state);
  const { mutate, isPending } = useMutation({
    mutationFn: () => deletePost(post._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
  const { mutate: mutateLike, isPending: isPendingLike } = useMutation({
    mutationFn: () => likePost(post._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const { data: isCreator } = useQuery({
    queryKey: [`user/${post._id}`],
    queryFn: async () => {
      const user = await getUser();
      const id = user._id || user.sub;
      return id === post.creator;
    },
    enabled: !!Cookies.get("token"),
  });

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "15px",
        height: "100%",
        position: "relative",
      }}
      raised
      elevation={6}
    >
      <CardActionArea>
        <CardMedia
          sx={{
            height: 0,
            paddingTop: "56.25%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backgroundBlendMode: "darken",
          }}
          image={post.selectedFile as string}
          title={post.title}
        />
      </CardActionArea>
      <Box position="absolute" top={20} left={20} color="white" pr={6}>
        <Typography variant="h6">{post.name}</Typography>
        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
      </Box>
      {isCreator && (
        <Box position="absolute" top={20} right={20} color="white">
          <IconButton size="small" onClick={() => setPostId(post._id)} color="inherit">
            <MoreHorizIcon fontSize="inherit" />
          </IconButton>
        </Box>
      )}
      <Box display="flex" flexWrap="wrap" gap={1} margin={2}>
        {post.tags.map((tag) => (
          <Chip key={tag} label={tag} />
        ))}
      </Box>
      <Typography paddingInline={2} paddingBlock={0} variant="h5" gutterBottom>
        {post.title}
      </Typography>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {post.message}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          padding: "0 16px 8px 16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          disabled={isPendingLike}
          startIcon={<ThumbUpAltIcon fontSize="small" />}
          size="small"
          onClick={() => mutateLike()}
        >
          {post.likes.length} &nbsp;
          {pluralize("Like", post.likes.length)}
        </Button>
        {isCreator && (
          <Button
            disabled={isPending}
            startIcon={<DeleteIcon fontSize="small" />}
            size="small"
            onClick={() => mutate()}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default Post;
